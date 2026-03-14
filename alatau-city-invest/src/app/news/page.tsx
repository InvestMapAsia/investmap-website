"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { newsLocalizedByLang, newsPageText } from "@/lib/i18n-content";
import { listNews } from "@/lib/mock-db";

export default function NewsPage() {
  const { lang } = useCurrentLanguage();
  const news = listNews();
  const t = pickLang(lang, newsPageText);
  const localizedNewsById = newsLocalizedByLang[lang];

  const localizedNews = useMemo(
    () =>
      news.map((item) => ({
        ...item,
        ...(localizedNewsById[item.id] ?? {}),
      })),
    [news, localizedNewsById]
  );

  return (
    <div className="container">
      <div className="section-title">
        <h2>{t.title}</h2>
        <p>{t.sub}</p>
      </div>

      <section className="grid grid-3">
        {localizedNews.map((item) => (
          <article className="card" key={item.id}>
            <span className="badge">{item.category}</span>
            <h3 className="card-title" style={{ marginTop: 8 }}>
              {item.title}
            </h3>
            <p className="muted">{new Date(item.date).toLocaleDateString(t.locale)}</p>
            <p style={{ marginTop: 8 }}>{item.excerpt}</p>
            <div className="plot-actions" style={{ marginTop: 12 }}>
              <Link href="/catalog" className="btn btn-ghost">
                {t.related}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
