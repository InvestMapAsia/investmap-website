"use client";

import { FormEvent, useEffect, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";

export function ContactForm() {
  const { lang } = useCurrentLanguage();
  const [ticket, setTicket] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    message: "",
  });

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
      projectInterest: "I want to invest in project",
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
      projectInterest: "Хочу инвестировать в проект",
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
      projectInterest: "Жобаға инвестиция салғым келеді",
    },
    CN: {
      title: "联系表单",
      name: "姓名",
      email: "邮箱",
      phone: "电话",
      category: "类别",
      investment: "投资",
      legalSupport: "法律支持",
      ownerListing: "业主发布",
      techSupport: "技术支持",
      message: "消息",
      send: "发送请求",
      ticket: "支持工单",
      registered: "已登记。",
      sla: "SLA：2 个工作小时内回复。",
      projectInterest: "我想投资项目",
    },
  });

  useEffect(() => {
    const projectId = new URLSearchParams(window.location.search).get("project");
    if (!projectId) return;

    setForm((prev) => {
      if (prev.message) return prev;
      return {
        ...prev,
        category: t.investment,
        message: `${t.projectInterest}: ${projectId}`,
      };
    });
  }, [t.investment, t.projectInterest]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTicket(`T-${Math.floor(Math.random() * 90000 + 10000)}`);
    setForm({
      name: "",
      email: "",
      phone: "",
      category: "",
      message: "",
    });
  };

  return (
    <>
      <section className="section card" id="contact-form">
        <h3 className="card-title">{t.title}</h3>
        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <div className="form-grid">
            <div className="form-field">
              <label>{t.name}</label>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.email}</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.phone}</label>
              <input
                required
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.category}</label>
              <select
                required
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              >
                <option value="" disabled>
                  {t.category}
                </option>
                <option value={t.investment}>{t.investment}</option>
                <option value={t.legalSupport}>{t.legalSupport}</option>
                <option value={t.ownerListing}>{t.ownerListing}</option>
                <option value={t.techSupport}>{t.techSupport}</option>
              </select>
            </div>
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.message}</label>
              <textarea
                required
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              />
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
