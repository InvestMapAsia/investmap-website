"use client";

import { ContactForm } from "@/components/contact-form";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export default function ContactsPage() {
  const { lang } = useCurrentLanguage();
  const t = pickLang(lang, {
    EN: {
      title: "Contacts and support",
      sub: "Direct channels for investment, legal and platform operations teams.",
      investDesk: "Investment desk",
      legalDesk: "Legal desk",
      supportDesk: "Platform support",
    },
    RU: {
      title: "Контакты и поддержка",
      sub: "Прямые каналы связи с инвестиционной, юридической и операционной командами.",
      investDesk: "Инвестиционный отдел",
      legalDesk: "Юридический отдел",
      supportDesk: "Поддержка платформы",
    },
    KZ: {
      title: "Байланыс және қолдау",
      sub: "Инвестиция, заң және платформа операциялары командаларына тікелей байланыс арналары.",
      investDesk: "Инвестиция бөлімі",
      legalDesk: "Заң бөлімі",
      supportDesk: "Платформа қолдауы",
    },
  });

  return (
    <div className="container" style={{ maxWidth: 980 }}>
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>

      <section className="grid grid-3">
        <article className="card">
          <h3 className="card-title">{t.investDesk}</h3>
          <p className="muted">+7 (700) 100-20-30</p>
          <p className="muted">invest@alatau-city-invest.com</p>
        </article>
        <article className="card">
          <h3 className="card-title">{t.legalDesk}</h3>
          <p className="muted">+7 (700) 100-20-31</p>
          <p className="muted">legal@alatau-city-invest.com</p>
        </article>
        <article className="card">
          <h3 className="card-title">{t.supportDesk}</h3>
          <p className="muted">+7 (700) 100-20-32</p>
          <p className="muted">support@alatau-city-invest.com</p>
        </article>
      </section>

      <ContactForm />
    </div>
  );
}
