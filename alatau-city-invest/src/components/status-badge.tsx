"use client";

import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { statusColor } from "@/lib/ui";
import { PlotStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: PlotStatus }) {
  const { lang } = useCurrentLanguage();

  const statusLabel = pickLang(lang, {
    EN: {
      available: "Available",
      reserved: "Reserved",
      deal: "In deal",
      moderation: "Moderation",
      sold: "Sold",
      legal_issue: "Legal issue",
    },
    RU: {
      available: "Доступен",
      reserved: "Резерв",
      deal: "В сделке",
      moderation: "Модерация",
      sold: "Продан",
      legal_issue: "Юр. проблема",
    },
    KZ: {
      available: "Қолжетімді",
      reserved: "Резерв",
      deal: "Мәміледе",
      moderation: "Модерация",
      sold: "Сатылған",
      legal_issue: "Заңдық мәселе",
    },
    CN: {
      available: "可用",
      reserved: "已预留",
      deal: "交易中",
      moderation: "审核中",
      sold: "已售出",
      legal_issue: "法律问题",
    },
  });

  return (
    <span className="badge">
      <span className="dot" style={{ background: statusColor[status] }} />
      {statusLabel[status]}
    </span>
  );
}
