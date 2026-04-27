"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { localizePlot } from "@/lib/i18n-content";
import { Plot } from "@/lib/types";

type Step = 0 | 1 | 2;

type ApplicationResponse = {
  data: {
    id: string;
    status: string;
  };
};

export function InvestForm({ plotId }: { plotId?: string }) {
  const { lang } = useCurrentLanguage();
  const [step, setStep] = useState<Step>(0);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const t = pickLang(lang, {
    EN: {
      failed: "Failed to submit application. Please check fields.",
      step1: "Step 1. Investor details",
      step2: "Step 2. Contacts and KYC",
      step3: "Step 3. Confirmation",
      plot: "Plot",
      investorType: "Investor type",
      investorName: "Investor name",
      amount: "Investment amount (USD)",
      phone: "Phone",
      email: "Email",
      source: "Source of funds",
      c1: "I confirm the provided information and agree to KYC/AML checks.",
      c2: "I accept platform legal terms and investment risk disclosure.",
      back: "Back",
      next: "Next",
      submitting: "Submitting...",
      submit: "Submit application",
      success: "submitted successfully.",
      currentStatus: "Current status: submitted. KYC/AML verification started.",
      openCabinet: "Open investor cabinet",
      individual: "Individual",
      company: "Company",
      fund: "Fund",
    },
    RU: {
      failed: "Не удалось отправить заявку. Проверьте поля.",
      step1: "Шаг 1. Данные инвестора",
      step2: "Шаг 2. Контакты и KYC",
      step3: "Шаг 3. Подтверждение",
      plot: "Участок",
      investorType: "Тип инвестора",
      investorName: "Имя инвестора",
      amount: "Сумма инвестиций (USD)",
      phone: "Телефон",
      email: "Email",
      source: "Источник средств",
      c1: "Подтверждаю корректность данных и согласие на проверки KYC/AML.",
      c2: "Принимаю юридические условия платформы и раскрытие инвестиционных рисков.",
      back: "Назад",
      next: "Далее",
      submitting: "Отправка...",
      submit: "Отправить заявку",
      success: "успешно отправлена.",
      currentStatus: "Текущий статус: submitted. Проверка KYC/AML запущена.",
      openCabinet: "Открыть кабинет инвестора",
      individual: "Физлицо",
      company: "Компания",
      fund: "Фонд",
    },
    KZ: {
      failed: "Өтінімді жіберу сәтсіз болды. Өрістерді тексеріңіз.",
      step1: "1-қадам. Инвестор деректері",
      step2: "2-қадам. Байланыс және KYC",
      step3: "3-қадам. Растау",
      plot: "Учаске",
      investorType: "Инвестор түрі",
      investorName: "Инвестор аты",
      amount: "Инвестиция сомасы (USD)",
      phone: "Телефон",
      email: "Email",
      source: "Қаражат көзі",
      c1: "Енгізілген деректерді растаймын және KYC/AML тексерістеріне келісемін.",
      c2: "Платформаның заңдық шарттары мен инвестициялық тәуекелдерді қабылдаймын.",
      back: "Артқа",
      next: "Келесі",
      submitting: "Жіберілуде...",
      submit: "Өтінім жіберу",
      success: "сәтті жіберілді.",
      currentStatus: "Ағымдағы статус: submitted. KYC/AML тексерісі басталды.",
      openCabinet: "Инвестор кабинетін ашу",
      individual: "Жеке тұлға",
      company: "Компания",
      fund: "Қор",
    },
    CN: {
      failed: "申请提交失败，请检查字段。",
      step1: "步骤 1. 投资人信息",
      step2: "步骤 2. 联系方式和 KYC",
      step3: "步骤 3. 确认",
      plot: "地块",
      investorType: "投资人类型",
      investorName: "投资人姓名",
      amount: "投资金额 (USD)",
      phone: "电话",
      email: "邮箱",
      source: "资金来源",
      c1: "我确认所填信息真实，并同意 KYC/AML 审核。",
      c2: "我接受平台法律条款和投资风险披露。",
      back: "返回",
      next: "下一步",
      submitting: "提交中...",
      submit: "提交申请",
      success: "已成功提交。",
      currentStatus: "当前状态：已提交。KYC/AML 审核已启动。",
      openCabinet: "打开投资人柜台",
      individual: "个人",
      company: "公司",
      fund: "基金",
    },
  });

  const [form, setForm] = useState({
    plotId: plotId ?? "",
    investorType: "individual",
    investorName: "",
    amount: "",
    phone: "",
    email: "",
    sourceOfFunds: "",
  });

  useEffect(() => {
    async function loadPlots() {
      const res = await fetch("/api/plots?status=all&risk=all&price=all&purpose=all");
      const payload = (await res.json()) as { data: Plot[] };
      const available = payload.data.filter((plot) => plot.status !== "sold");
      setPlots(available);

      if (!form.plotId && available[0]) {
        setForm((prev) => ({ ...prev, plotId: available[0].id }));
      }
    }

    void loadPlots();
  }, [form.plotId]);

  const canNext = useMemo(() => {
    if (step === 0) {
      return Boolean(form.plotId && form.investorName && form.amount);
    }
    if (step === 1) {
      return Boolean(form.phone && form.email && form.sourceOfFunds);
    }
    return true;
  }, [form, step]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plotId: form.plotId,
        investorName: form.investorName,
        investorType: form.investorType,
        amount: Number(form.amount),
        phone: form.phone,
        email: form.email,
        sourceOfFunds: form.sourceOfFunds,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      window.alert(t.failed);
      return;
    }

    const payload = (await res.json()) as ApplicationResponse;
    setResultId(payload.data.id);
  };

  return (
    <>
      <section className="card">
        <div className="stepper">
          <div className={step >= 0 ? "step active" : "step"} />
          <div className={step >= 1 ? "step active" : "step"} />
          <div className={step >= 2 ? "step active" : "step"} />
        </div>

        <form onSubmit={submit}>
          {step === 0 ? (
            <div>
              <h3 className="card-title">{t.step1}</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>{t.plot}</label>
                  <select
                    value={form.plotId}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, plotId: event.target.value }))
                    }
                    required
                  >
                    {plots.map((plot) => {
                      const displayPlot = localizePlot(lang, plot);
                      return (
                        <option key={plot.id} value={plot.id}>
                          {plot.id} · {displayPlot.title}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-field">
                  <label>{t.investorType}</label>
                  <select
                    value={form.investorType}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, investorType: event.target.value }))
                    }
                  >
                    <option value="individual">{t.individual}</option>
                    <option value="company">{t.company}</option>
                    <option value="fund">{t.fund}</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>{t.investorName}</label>
                  <input
                    value={form.investorName}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, investorName: event.target.value }))
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>{t.amount}</label>
                  <input
                    type="number"
                    min={10000}
                    value={form.amount}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, amount: event.target.value }))
                    }
                    required
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div>
              <h3 className="card-title">{t.step2}</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>{t.phone}</label>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>{t.email}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    required
                  />
                </div>
                <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                  <label>{t.source}</label>
                  <textarea
                    value={form.sourceOfFunds}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, sourceOfFunds: event.target.value }))
                    }
                    required
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h3 className="card-title">{t.step3}</h3>
              <label className="checkbox-line">
                <input required type="checkbox" />
                <span>{t.c1}</span>
              </label>
              <label className="checkbox-line" style={{ marginTop: 8 }}>
                <input required type="checkbox" />
                <span>{t.c2}</span>
              </label>
            </div>
          ) : null}

          <div className="plot-actions" style={{ marginTop: 14 }}>
            <button
              type="button"
              className={step === 0 ? "btn btn-ghost hidden" : "btn btn-ghost"}
              onClick={() => setStep((prev) => Math.max(0, prev - 1) as Step)}
            >
              {t.back}
            </button>

            {step < 2 ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={!canNext}
                onClick={() => setStep((prev) => Math.min(2, prev + 1) as Step)}
              >
                {t.next}
              </button>
            ) : (
              <button type="submit" className="btn btn-accent" disabled={submitting}>
                {submitting ? t.submitting : t.submit}
              </button>
            )}
          </div>
        </form>
      </section>

      {resultId ? (
        <section className="section card">
          <strong>
            Application {resultId} {t.success}
          </strong>
          <p className="muted">{t.currentStatus}</p>
          <div className="plot-actions" style={{ marginTop: 12 }}>
            <Link href="/cabinet/investor" className="btn btn-primary">
              {t.openCabinet}
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
