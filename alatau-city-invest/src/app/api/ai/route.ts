import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { normalizeLang, pickLang } from "@/lib/i18n";
import { sanitizeText } from "@/lib/input-security";
import { aiAnalyze } from "@/lib/mock-db";

const extractionAttempt =
  /\b(ignore previous|show all|dump|database|db data|all database|secrets?|tokens?|passwords?|admin data|private data|чужие данные|база данных|парол|секрет)\b/i;

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? checkRateLimit(`ai:${getClientIp(request)}`, 20);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { prompt?: string; lang?: string | null } | null;
  const lang = normalizeLang(body?.lang);
  const copy = pickLang(lang, {
    EN: {
      promptRequired: "Prompt is required",
      blocked:
        "I can help compare public investment opportunities, risks and ROI, but I cannot reveal private accounts, admin data, secrets or database dumps.",
    },
    RU: {
      promptRequired: "Введите запрос",
      blocked:
        "Я могу сравнить публичные инвестиционные возможности, риски и ROI, но не раскрываю частные аккаунты, админ-данные, секреты или выгрузки базы данных.",
    },
    KZ: {
      promptRequired: "Сұрау енгізіңіз",
      blocked:
        "Мен ашық инвестициялық мүмкіндіктерді, тәуекелдерді және ROI көрсеткішін салыстыра аламын, бірақ жеке аккаунттарды, әкімші деректерін, құпияларды немесе база көшірмесін ашпаймын.",
    },
    CN: {
      promptRequired: "请输入问题",
      blocked:
        "我可以比较公开的投资机会、风险和 ROI，但不能泄露私人账户、管理员数据、密钥或数据库导出内容。",
    },
  });

  const prompt = sanitizeText(body?.prompt, 2_000);
  if (!prompt) {
    return NextResponse.json({ error: copy.promptRequired }, { status: 400 });
  }

  if (extractionAttempt.test(prompt)) {
    return NextResponse.json({
      data: {
        answer: copy.blocked,
      },
    });
  }

  const answer = aiAnalyze(prompt, lang);
  return NextResponse.json({ data: { answer } });
}
