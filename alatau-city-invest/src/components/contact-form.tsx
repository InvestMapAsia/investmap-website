"use client";

import { FormEvent, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export function ContactForm() {
  const { lang } = useCurrentLanguage();
  const [ticket, setTicket] = useState<string | null>(null);

  const t = pickLang(lang, {
    EN: {
      title: "Contact form",
      name: "Name",
      email: "Email",
      phone: "Phone",
      category: "Category",
      investment: "Investment",
      legalSupport: "Legal support",
      ownerListing: "Owner listing",
      techSupport: "Technical support",
      message: "Message",
      send: "Send request",
      ticket: "Support ticket",
      registered: "registered.",
      sla: "SLA: response within 2 business hours.",
    },
    RU: {
      title: "Форма обращения",
      name: "Имя",
      email: "Email",
      phone: "Телефон",
      category: "Категория",
      investment: "Инвестиции",
      legalSupport: "Юридическая поддержка",
      ownerListing: "Размещение собственника",
      techSupport: "Техническая поддержка",
      message: "Сообщение",
      send: "Отправить запрос",
      ticket: "Тикет поддержки",
      registered: "зарегистрирован.",
      sla: "SLA: ответ в течение 2 рабочих часов.",
    },
    KZ: {
      title: "Байланыс формасы",
      name: "Аты",
      email: "Email",
      phone: "Телефон",
      category: "Санат",
      investment: "Инвестиция",
      legalSupport: "Заң қолдауы",
      ownerListing: "Жер иесі листингі",
      techSupport: "Техникалық қолдау",
      message: "Хабарлама",
      send: "Сұраныс жіберу",
      ticket: "Қолдау тикеті",
      registered: "тіркелді.",
      sla: "SLA: 2 жұмыс сағаты ішінде жауап.",
    },
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTicket(`T-${Math.floor(Math.random() * 90000 + 10000)}`);
    event.currentTarget.reset();
  };

  return (
    <>
      <section className="section card">
        <h3 className="card-title">{t.title}</h3>
        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <div className="form-grid">
            <div className="form-field">
              <label>{t.name}</label>
              <input required />
            </div>
            <div className="form-field">
              <label>{t.email}</label>
              <input required type="email" />
            </div>
            <div className="form-field">
              <label>{t.phone}</label>
              <input required />
            </div>
            <div className="form-field">
              <label>{t.category}</label>
              <select required>
                <option>{t.investment}</option>
                <option>{t.legalSupport}</option>
                <option>{t.ownerListing}</option>
                <option>{t.techSupport}</option>
              </select>
            </div>
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.message}</label>
              <textarea required />
            </div>
          </div>

          <div className="plot-actions" style={{ marginTop: 12 }}>
            <button className="btn btn-primary" type="submit">
              {t.send}
            </button>
          </div>
        </form>
      </section>

      {ticket ? (
        <section className="section card">
          <strong>
            {t.ticket} {ticket} {t.registered}
          </strong>
          <p className="muted">{t.sla}</p>
        </section>
      ) : null}
    </>
  );
}
