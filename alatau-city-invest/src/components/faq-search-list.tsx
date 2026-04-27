"use client";

import { useMemo, useState } from "react";
import { FaqItem } from "@/lib/types";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export function FaqSearchList({ items }: { items: FaqItem[] }) {
  const { lang } = useCurrentLanguage();
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const t = pickLang(lang, {
    EN: {
      label: "Search FAQ",
      placeholder: "Example: legal verification",
      empty: "No FAQ entries match your search.",
    },
    RU: {
      label: "Поиск по FAQ",
      placeholder: "Например: юридическая проверка",
      empty: "По вашему запросу ничего не найдено.",
    },
    KZ: {
      label: "FAQ іздеу",
      placeholder: "Мысалы: заңдық тексеріс",
      empty: "Сұрауыңыз бойынша FAQ табылмады.",
    },
    CN: {
      label: "搜索 FAQ",
      placeholder: "例如：法律核验",
      empty: "没有匹配的 FAQ 内容。",
    },
  });

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term)
    );
  }, [items, query]);

  return (
    <>
      <section className="card" style={{ marginBottom: 16 }}>
        <div className="form-field">
          <label>{t.label}</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.placeholder}
          />
        </div>
      </section>

      <section className="grid">
        {filtered.length ? (
          filtered.map((item, index) => (
            <article className="card" key={item.question}>
              <button
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "space-between" }}
                onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                type="button"
              >
                <span>{item.question}</span>
                <span>{openIndex === index ? "-" : "+"}</span>
              </button>
              {openIndex === index ? (
                <p className="muted" style={{ marginTop: 10 }}>
                  {item.answer}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <div className="empty-state">{t.empty}</div>
        )}
      </section>
    </>
  );
}
