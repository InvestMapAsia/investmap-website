"use client";

import { useEffect, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { localeByLang } from "@/lib/i18n-content";

export function LegalAcceptPanel() {
  const { lang } = useCurrentLanguage();
  const locale = localeByLang(lang);
  const [accept1, setAccept1] = useState(false);
  const [accept2, setAccept2] = useState(false);
  const [accept3, setAccept3] = useState(false);
  const [status, setStatus] = useState("");

  const t = pickLang(lang, {
    EN: {
      notRecorded: "Consent not yet recorded.",
      lastConsent: "Last consent:",
      alert: "Please confirm all required legal consents.",
      title: "Consent capture",
      c1: "I accept platform terms of use.",
      c2: "I accept privacy and AML/KYC policy.",
      c3: "I understand investment risk disclosure.",
      save: "Record consent",
    },
    RU: {
      notRecorded: "Согласие еще не зафиксировано.",
      lastConsent: "Последнее согласие:",
      alert: "Подтвердите все обязательные юридические согласия.",
      title: "Фиксация согласий",
      c1: "Я принимаю условия использования платформы.",
      c2: "Я принимаю политику конфиденциальности и AML/KYC.",
      c3: "Я понимаю раскрытие инвестиционных рисков.",
      save: "Зафиксировать согласие",
    },
    KZ: {
      notRecorded: "Келісім әлі тіркелмеген.",
      lastConsent: "Соңғы келісім:",
      alert: "Барлық міндетті заң келісімдерін растаңыз.",
      title: "Келісімді тіркеу",
      c1: "Платформаны пайдалану шарттарын қабылдаймын.",
      c2: "Құпиялылық және AML/KYC саясатын қабылдаймын.",
      c3: "Инвестициялық тәуекелдерді түсінемін.",
      save: "Келісімді тіркеу",
    },
    CN: {
      notRecorded: "尚未记录同意。",
      lastConsent: "上次同意：",
      alert: "请确认所有必需的法律同意项。",
      title: "同意确认",
      c1: "我接受平台使用条款。",
      c2: "我接受隐私政策和 AML/KYC 政策。",
      c3: "我理解投资风险披露。",
      save: "记录同意",
    },
  });

  useEffect(() => {
    const raw = localStorage.getItem("aci_legal_accept");
    if (raw) {
      try {
        const payload = JSON.parse(raw) as { acceptedAt: string; version: string };
        setStatus(`${t.lastConsent} ${new Date(payload.acceptedAt).toLocaleString(locale)}`);
      } catch {
        setStatus(t.notRecorded);
      }
    } else {
      setStatus(t.notRecorded);
    }
  }, [locale, t.lastConsent, t.notRecorded]);

  const save = () => {
    if (!accept1 || !accept2 || !accept3) {
      window.alert(t.alert);
      return;
    }

    const payload = { acceptedAt: new Date().toISOString(), version: "2026.03.1" };
    localStorage.setItem("aci_legal_accept", JSON.stringify(payload));
    setStatus(`${t.lastConsent} ${new Date(payload.acceptedAt).toLocaleString(locale)}`);
  };

  return (
    <section className="section card">
      <h3 className="card-title">{t.title}</h3>
      <label className="checkbox-line" style={{ marginTop: 10 }}>
        <input checked={accept1} onChange={(event) => setAccept1(event.target.checked)} type="checkbox" />
        <span>{t.c1}</span>
      </label>
      <label className="checkbox-line" style={{ marginTop: 8 }}>
        <input checked={accept2} onChange={(event) => setAccept2(event.target.checked)} type="checkbox" />
        <span>{t.c2}</span>
      </label>
      <label className="checkbox-line" style={{ marginTop: 8 }}>
        <input checked={accept3} onChange={(event) => setAccept3(event.target.checked)} type="checkbox" />
        <span>{t.c3}</span>
      </label>

      <div className="plot-actions" style={{ marginTop: 12 }}>
        <button className="btn btn-primary" onClick={save} type="button">
          {t.save}
        </button>
      </div>
      <p className="muted" style={{ marginTop: 10 }}>
        {status}
      </p>
    </section>
  );
}
