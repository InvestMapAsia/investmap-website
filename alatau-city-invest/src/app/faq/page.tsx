"use client";

import Link from "next/link";
import { FaqSearchList } from "@/components/faq-search-list";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { faqItemsByLang, faqPageText } from "@/lib/i18n-content";
import { listFaqs } from "@/lib/mock-db";

export default function FaqPage() {
  const { lang } = useCurrentLanguage();
  const baseFaqs = listFaqs();
  const t = pickLang(lang, faqPageText);
  const faqs = faqItemsByLang[lang] ?? baseFaqs;

  return (
    <div className="container" style={{ maxWidth: 980 }}>
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>

      <FaqSearchList items={faqs} />

      <section className="section card">
        <h3 className="card-title">{t.help}</h3>
        <p className="muted">{t.helpSub}</p>
        <div className="plot-actions" style={{ marginTop: 12 }}>
          <Link href="/contacts" className="btn btn-primary">
            {t.contact}
          </Link>
          <Link href="/ai-assistant" className="btn btn-ghost">
            {t.openAi}
          </Link>
        </div>
      </section>
    </div>
  );
}
