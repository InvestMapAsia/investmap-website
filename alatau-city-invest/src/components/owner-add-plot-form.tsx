"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";

type CreateResult = {
  data: { id: string; status: string };
  qualityScore: number;
};

export function OwnerAddPlotForm() {
  const { lang } = useCurrentLanguage();
  const [form, setForm] = useState({
    title: "",
    cadastral: "",
    district: "",
    purpose: "Commercial",
    area: "",
    price: "",
    roi: "",
    irr: "",
    distanceCenterKm: "",
    legalOwnerType: "Individual",
    hasUtilities: true,
    description: "",
  });

  const [result, setResult] = useState<CreateResult | null>(null);
  const [saving, setSaving] = useState(false);

  const t = pickLang(lang, {
    EN: {
      qualityScore: "Listing quality score",
      title: "Title",
      cadastral: "Cadastral number",
      district: "District",
      purpose: "Purpose",
      area: "Area (ha)",
      price: "Price (USD)",
      roi: "ROI (%)",
      irr: "IRR (%)",
      distanceCenterKm: "Distance to center (km)",
      legalOwnerType: "Legal owner type",
      utilitiesConfirmed: "Utilities confirmed",
      description: "Description",
      purposeCommercial: "Commercial",
      purposeMixed: "Mixed-use",
      purposeResidential: "Residential",
      purposeLogistics: "Logistics",
      purposeIndustrial: "Industrial",
      ownerIndividual: "Individual",
      ownerCompany: "Company",
      ownerPpp: "PPP",
      yes: "Yes",
      no: "No",
      submitError: "Failed to create owner listing. Check required fields.",
      submitting: "Submitting...",
      submit: "Submit for moderation",
      choosePricing: "Choose pricing plan",
      successTitle: "Plot submitted successfully.",
      status: "Status",
      quality: "Quality score",
      openOwnerCabinet: "Open owner cabinet",
    },
    RU: {
      qualityScore: "Оценка качества листинга",
      title: "Название",
      cadastral: "Кадастровый номер",
      district: "Район",
      purpose: "Назначение",
      area: "Площадь (га)",
      price: "Цена (USD)",
      roi: "ROI (%)",
      irr: "IRR (%)",
      distanceCenterKm: "Расстояние до центра (км)",
      legalOwnerType: "Тип владельца",
      utilitiesConfirmed: "Коммуникации подтверждены",
      description: "Описание",
      purposeCommercial: "Коммерческое",
      purposeMixed: "Смешанное",
      purposeResidential: "Жилое",
      purposeLogistics: "Логистика",
      purposeIndustrial: "Промышленное",
      ownerIndividual: "Физлицо",
      ownerCompany: "Компания",
      ownerPpp: "ГЧП",
      yes: "Да",
      no: "Нет",
      submitError: "Не удалось создать листинг. Проверьте обязательные поля.",
      submitting: "Отправка...",
      submit: "Отправить на модерацию",
      choosePricing: "Выбрать тариф",
      successTitle: "Участок успешно отправлен.",
      status: "Статус",
      quality: "Оценка качества",
      openOwnerCabinet: "Открыть кабинет владельца",
    },
    KZ: {
      qualityScore: "Листинг сапа бағасы",
      title: "Атауы",
      cadastral: "Кадастр нөмірі",
      district: "Аудан",
      purpose: "Мақсаты",
      area: "Аумағы (га)",
      price: "Бағасы (USD)",
      roi: "ROI (%)",
      irr: "IRR (%)",
      distanceCenterKm: "Орталыққа дейінгі қашықтық (км)",
      legalOwnerType: "Иесінің құқықтық түрі",
      utilitiesConfirmed: "Коммуникация расталған",
      description: "Сипаттама",
      purposeCommercial: "Коммерциялық",
      purposeMixed: "Аралас",
      purposeResidential: "Тұрғын",
      purposeLogistics: "Логистика",
      purposeIndustrial: "Өнеркәсіптік",
      ownerIndividual: "Жеке тұлға",
      ownerCompany: "Компания",
      ownerPpp: "МЖӘ",
      yes: "Иә",
      no: "Жоқ",
      submitError: "Листинг құру сәтсіз. Міндетті өрістерді тексеріңіз.",
      submitting: "Жіберілуде...",
      submit: "Модерацияға жіберу",
      choosePricing: "Тариф таңдау",
      successTitle: "Учаске сәтті жіберілді.",
      status: "Статус",
      quality: "Сапа бағасы",
      openOwnerCabinet: "Жер иесі кабинетіне өту",
    },
  });

  const score = useMemo(() => {
    let next = 0;
    if (form.title.trim().length > 3) next += 10;
    if (form.cadastral.trim().length >= 6) next += 10;
    if (form.district.trim().length > 1) next += 10;
    if (form.purpose.trim().length > 1) next += 10;
    if (Number(form.area) > 0) next += 10;
    if (Number(form.price) >= 10000) next += 10;
    if (form.legalOwnerType.trim().length > 1) next += 10;
    if (form.hasUtilities) next += 10;
    if (form.description.trim().length > 120) next += 20;
    return Math.min(100, next);
  }, [form]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const response = await fetch("/api/owner/plots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        area: Number(form.area),
        price: Number(form.price),
        roi: form.roi ? Number(form.roi) : undefined,
        irr: form.irr ? Number(form.irr) : undefined,
        distanceCenterKm: form.distanceCenterKm ? Number(form.distanceCenterKm) : undefined,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      window.alert(t.submitError);
      return;
    }

    const payload = (await response.json()) as CreateResult;
    setResult(payload);

    setForm({
      title: "",
      cadastral: "",
      district: "",
      purpose: "Commercial",
      area: "",
      price: "",
      roi: "",
      irr: "",
      distanceCenterKm: "",
      legalOwnerType: "Individual",
      hasUtilities: true,
      description: "",
    });
  };

  return (
    <>
      <section className="card">
        <div className="metric-line">
          <span className="muted">{t.qualityScore}</span>
          <strong>{score}/100</strong>
        </div>

        <form onSubmit={submit} style={{ marginTop: 14 }}>
          <div className="form-grid">
            <div className="form-field">
              <label>{t.title}</label>
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label>{t.cadastral}</label>
              <input
                value={form.cadastral}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, cadastral: event.target.value }))
                }
                required
              />
            </div>
            <div className="form-field">
              <label>{t.district}</label>
              <input
                value={form.district}
                onChange={(event) => setForm((prev) => ({ ...prev, district: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label>{t.purpose}</label>
              <select
                value={form.purpose}
                onChange={(event) => setForm((prev) => ({ ...prev, purpose: event.target.value }))}
              >
                <option value="Commercial">{t.purposeCommercial}</option>
                <option value="Mixed-use">{t.purposeMixed}</option>
                <option value="Residential">{t.purposeResidential}</option>
                <option value="Logistics">{t.purposeLogistics}</option>
                <option value="Industrial">{t.purposeIndustrial}</option>
              </select>
            </div>
            <div className="form-field">
              <label>{t.area}</label>
              <input
                type="number"
                step="0.1"
                value={form.area}
                onChange={(event) => setForm((prev) => ({ ...prev, area: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label>{t.price}</label>
              <input
                type="number"
                min={10000}
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label>{t.roi}</label>
              <input
                type="number"
                step="0.1"
                value={form.roi}
                onChange={(event) => setForm((prev) => ({ ...prev, roi: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.irr}</label>
              <input
                type="number"
                step="0.1"
                value={form.irr}
                onChange={(event) => setForm((prev) => ({ ...prev, irr: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.distanceCenterKm}</label>
              <input
                type="number"
                step="0.1"
                value={form.distanceCenterKm}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, distanceCenterKm: event.target.value }))
                }
              />
            </div>
            <div className="form-field">
              <label>{t.legalOwnerType}</label>
              <select
                value={form.legalOwnerType}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, legalOwnerType: event.target.value }))
                }
              >
                <option value="Individual">{t.ownerIndividual}</option>
                <option value="Company">{t.ownerCompany}</option>
                <option value="PPP">{t.ownerPpp}</option>
              </select>
            </div>
            <div className="form-field">
              <label>{t.utilitiesConfirmed}</label>
              <select
                value={String(form.hasUtilities)}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, hasUtilities: event.target.value === "true" }))
                }
              >
                <option value="true">{t.yes}</option>
                <option value="false">{t.no}</option>
              </select>
            </div>
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.description}</label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="plot-actions" style={{ marginTop: 14 }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? t.submitting : t.submit}
            </button>
            <Link className="btn btn-ghost" href="/pricing">
              {t.choosePricing}
            </Link>
          </div>
        </form>
      </section>

      {result ? (
        <section className="section card">
          <strong>
            {result.data.id} {t.successTitle}
          </strong>
          <p className="muted">
            {t.status}: {result.data.status}. {t.quality}: {result.qualityScore}/100.
          </p>
          <div className="plot-actions" style={{ marginTop: 12 }}>
            <Link href="/cabinet/owner" className="btn btn-primary">
              {t.openOwnerCabinet}
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
