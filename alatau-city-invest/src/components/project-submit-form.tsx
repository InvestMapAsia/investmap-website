"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";

type SubmitResult = {
  data: { id: string; status: string };
  readinessScore: number;
};

type GeocodeResponse = {
  data?: {
    results?: Array<{ place?: string; lat?: number; lng?: number }>;
  };
  error?: string;
};

function parseMediaLinks(input: string) {
  return input
    .split(/\r?\n|,/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function ProjectSubmitForm() {
  const { lang } = useCurrentLanguage();
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [form, setForm] = useState({
    companyName: "",
    businessOverview: "",
    market: "",
    businessModel: "",
    traction: "",
    legalReadiness: "",
    financialForecasts: "",
    investmentTerms: "",
    founderName: "",
    founderEmail: "",
    founderPhone: "",
    city: "",
    website: "",
    requestedAmount: "",
    minimumTicket: "",
    mediaLinks: "",
    mapAddress: "",
    mapLat: "",
    mapLng: "",
  });

  const t = pickLang(lang, {
    EN: {
      readiness: "Readiness score",
      companyName: "1. Company name",
      businessOverview: "2. What is the business about",
      market: "3. Specific market",
      businessModel: "4. Business model",
      traction: "5. Prototype or first results",
      legalReadiness: "6. Legal readiness",
      financialForecasts: "7. Financial forecasts",
      investmentTerms: "8. Investment terms",
      founderName: "Founder full name",
      founderEmail: "Founder email",
      founderPhone: "Founder phone",
      city: "City",
      website: "Website",
      requestedAmount: "Requested amount (USD)",
      minimumTicket: "Minimum ticket (USD)",
      mediaLinks: "Photo/video links (one URL per line)",
      mapAddress: "Map address or place",
      mapLat: "Latitude",
      mapLng: "Longitude",
      findCoords: "Find coordinates",
      openGoogleMap: "Open in Google Maps",
      mapHint: "You can enter address and get coordinates, or fill lat/lng manually.",
      geocodeNoAddress: "Enter map address first.",
      geocodeError: "Could not get coordinates from map service.",
      geocodeNoResults: "No map results found for this address.",
      submit: "Submit project",
      submitting: "Submitting...",
      locating: "Finding...",
      submitError: "Failed to submit project. Check required fields and try again.",
      unauthorized: "Please sign in first.",
      success: "Project has been submitted for moderation.",
      status: "Status",
      openProjects: "Open projects board",
      openInvestorCabinet: "Open investor cabinet",
    },
    RU: {
      readiness: "Оценка готовности",
      companyName: "1. Название компании",
      businessOverview: "2. О чем бизнес",
      market: "3. Конкретный рынок",
      businessModel: "4. Бизнес-модель",
      traction: "5. Наличие прототипа или первых результатов",
      legalReadiness: "6. Юридическая готовность",
      financialForecasts: "7. Финансовые прогнозы",
      investmentTerms: "8. Условия инвестирования",
      founderName: "ФИО основателя",
      founderEmail: "Email основателя",
      founderPhone: "Телефон основателя",
      city: "Город",
      website: "Сайт",
      requestedAmount: "Необходимая сумма (USD)",
      minimumTicket: "Минимальный билет (USD)",
      mediaLinks: "Ссылки на фото/видео (по одной в строке)",
      mapAddress: "Адрес или точка на карте",
      mapLat: "Широта",
      mapLng: "Долгота",
      findCoords: "Найти координаты",
      openGoogleMap: "Открыть в Google Maps",
      mapHint: "Можно ввести адрес и получить координаты, либо указать широту/долготу вручную.",
      geocodeNoAddress: "Сначала введите адрес для карты.",
      geocodeError: "Не удалось получить координаты из карт-сервиса.",
      geocodeNoResults: "По этому адресу не найдено точек на карте.",
      submit: "Отправить проект",
      submitting: "Отправка...",
      locating: "Поиск...",
      submitError: "Не удалось отправить проект. Проверьте обязательные поля.",
      unauthorized: "Сначала выполните вход.",
      success: "Проект отправлен на модерацию.",
      status: "Статус",
      openProjects: "Открыть витрину проектов",
      openInvestorCabinet: "Открыть кабинет инвестора",
    },
    KZ: {
      readiness: "Дайындық бағасы",
      companyName: "1. Компания атауы",
      businessOverview: "2. Бизнес сипаттамасы",
      market: "3. Нақты нарық",
      businessModel: "4. Бизнес-модель",
      traction: "5. Прототип немесе алғашқы нәтижелер",
      legalReadiness: "6. Заңдық дайындық",
      financialForecasts: "7. Қаржылық болжамдар",
      investmentTerms: "8. Инвестиция шарттары",
      founderName: "Құрушының аты-жөні",
      founderEmail: "Құрушы email",
      founderPhone: "Құрушы телефоны",
      city: "Қала",
      website: "Сайт",
      requestedAmount: "Қажетті сома (USD)",
      minimumTicket: "Минималды билет (USD)",
      mediaLinks: "Фото/видео сілтемелері (әр жолға біреуі)",
      mapAddress: "Картадағы мекенжай немесе нүкте",
      mapLat: "Ендік",
      mapLng: "Бойлық",
      findCoords: "Координат табу",
      openGoogleMap: "Google Maps-те ашу",
      mapHint: "Мекенжай енгізіп координат табыңыз немесе ендік/бойлықты қолмен толтырыңыз.",
      geocodeNoAddress: "Алдымен карта үшін мекенжай енгізіңіз.",
      geocodeError: "Карта сервисінен координат алу сәтсіз болды.",
      geocodeNoResults: "Осы мекенжай бойынша картадан нүкте табылмады.",
      submit: "Жобаны жіберу",
      submitting: "Жіберілуде...",
      locating: "Іздеу...",
      submitError: "Жобаны жіберу сәтсіз. Міндетті өрістерді тексеріңіз.",
      unauthorized: "Алдымен жүйеге кіріңіз.",
      success: "Жоба модерацияға жіберілді.",
      status: "Статус",
      openProjects: "Жобалар витринасын ашу",
      openInvestorCabinet: "Инвестор кабинетін ашу",
    },
  });

  const mediaLinks = useMemo(() => parseMediaLinks(form.mediaLinks), [form.mediaLinks]);

  const score = useMemo(() => {
    let next = 0;
    if (form.companyName.trim().length >= 3) next += 10;
    if (form.businessOverview.trim().length >= 60) next += 15;
    if (form.market.trim().length >= 20) next += 12;
    if (form.businessModel.trim().length >= 30) next += 12;
    if (form.traction.trim().length >= 30) next += 14;
    if (form.legalReadiness.trim().length >= 20) next += 12;
    if (form.financialForecasts.trim().length >= 25) next += 12;
    if (form.investmentTerms.trim().length >= 25) next += 10;
    if (form.founderName.trim().length >= 4) next += 1;
    if (form.founderEmail.includes("@")) next += 1;
    if (form.founderPhone.trim().length >= 8) next += 1;
    if (form.website.startsWith("http")) next += 1;
    if (mediaLinks.length > 0) next += 1;
    if (form.mapLat.trim().length > 0 && form.mapLng.trim().length > 0) next += 1;
    return Math.min(100, next);
  }, [form, mediaLinks.length]);

  const googleMapUrl = useMemo(() => {
    if (form.mapLat && form.mapLng) {
      return `https://www.google.com/maps?q=${encodeURIComponent(`${form.mapLat},${form.mapLng}`)}`;
    }
    if (form.mapAddress.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.mapAddress.trim())}`;
    }
    return null;
  }, [form.mapAddress, form.mapLat, form.mapLng]);

  const locateAddress = async () => {
    if (!form.mapAddress.trim()) {
      window.alert(t.geocodeNoAddress);
      return;
    }

    setLocating(true);
    const response = await fetch(
      `/api/integrations/maps/geocode?query=${encodeURIComponent(form.mapAddress.trim())}`,
      { cache: "no-store" }
    );
    setLocating(false);

    if (!response.ok) {
      window.alert(t.geocodeError);
      return;
    }

    const payload = (await response.json()) as GeocodeResponse;
    const first = payload.data?.results?.[0];

    if (!first || first.lat === undefined || first.lng === undefined) {
      window.alert(t.geocodeNoResults);
      return;
    }

    setForm((prev) => ({
      ...prev,
      mapAddress: first.place?.trim() || prev.mapAddress,
      mapLat: String(first.lat),
      mapLng: String(first.lng),
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.companyName,
        businessOverview: form.businessOverview,
        market: form.market,
        businessModel: form.businessModel,
        traction: form.traction,
        legalReadiness: form.legalReadiness,
        financialForecasts: form.financialForecasts,
        investmentTerms: form.investmentTerms,
        founderName: form.founderName,
        founderEmail: form.founderEmail,
        founderPhone: form.founderPhone,
        city: form.city || undefined,
        website: form.website || undefined,
        requestedAmount: form.requestedAmount ? Number(form.requestedAmount) : undefined,
        minimumTicket: form.minimumTicket ? Number(form.minimumTicket) : undefined,
        mediaUrls: mediaLinks,
        mapAddress: form.mapAddress || undefined,
        mapLat: form.mapLat ? Number(form.mapLat) : undefined,
        mapLng: form.mapLng ? Number(form.mapLng) : undefined,
      }),
    });

    setSaving(false);

    if (response.status === 401) {
      window.alert(t.unauthorized);
      return;
    }

    if (!response.ok) {
      window.alert(t.submitError);
      return;
    }

    const payload = (await response.json()) as SubmitResult;
    setResult(payload);

    setForm({
      companyName: "",
      businessOverview: "",
      market: "",
      businessModel: "",
      traction: "",
      legalReadiness: "",
      financialForecasts: "",
      investmentTerms: "",
      founderName: "",
      founderEmail: "",
      founderPhone: "",
      city: "",
      website: "",
      requestedAmount: "",
      minimumTicket: "",
      mediaLinks: "",
      mapAddress: "",
      mapLat: "",
      mapLng: "",
    });
  };

  return (
    <>
      <section className="card">
        <div className="metric-line">
          <span className="muted">{t.readiness}</span>
          <strong>{score}/100</strong>
        </div>

        <form onSubmit={submit} style={{ marginTop: 14 }}>
          <div className="form-grid">
            <div className="form-field">
              <label>{t.companyName}</label>
              <input
                value={form.companyName}
                onChange={(event) => setForm((prev) => ({ ...prev, companyName: event.target.value }))}
                required
              />
            </div>

            <div className="form-field">
              <label>{t.market}</label>
              <input
                value={form.market}
                onChange={(event) => setForm((prev) => ({ ...prev, market: event.target.value }))}
                required
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.businessOverview}</label>
              <textarea
                value={form.businessOverview}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, businessOverview: event.target.value }))
                }
                required
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.businessModel}</label>
              <textarea
                value={form.businessModel}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, businessModel: event.target.value }))
                }
                required
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.traction}</label>
              <textarea
                value={form.traction}
                onChange={(event) => setForm((prev) => ({ ...prev, traction: event.target.value }))}
                required
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.legalReadiness}</label>
              <textarea
                value={form.legalReadiness}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, legalReadiness: event.target.value }))
                }
                required
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.financialForecasts}</label>
              <textarea
                value={form.financialForecasts}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, financialForecasts: event.target.value }))
                }
                required
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.investmentTerms}</label>
              <textarea
                value={form.investmentTerms}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, investmentTerms: event.target.value }))
                }
                required
              />
            </div>

            <div className="form-field">
              <label>{t.founderName}</label>
              <input
                value={form.founderName}
                onChange={(event) => setForm((prev) => ({ ...prev, founderName: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label>{t.founderEmail}</label>
              <input
                type="email"
                value={form.founderEmail}
                onChange={(event) => setForm((prev) => ({ ...prev, founderEmail: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label>{t.founderPhone}</label>
              <input
                value={form.founderPhone}
                onChange={(event) => setForm((prev) => ({ ...prev, founderPhone: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label>{t.city}</label>
              <input
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.website}</label>
              <input
                value={form.website}
                onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="form-field">
              <label>{t.requestedAmount}</label>
              <input
                type="number"
                min={1000}
                value={form.requestedAmount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, requestedAmount: event.target.value }))
                }
              />
            </div>
            <div className="form-field">
              <label>{t.minimumTicket}</label>
              <input
                type="number"
                min={100}
                value={form.minimumTicket}
                onChange={(event) => setForm((prev) => ({ ...prev, minimumTicket: event.target.value }))}
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.mediaLinks}</label>
              <textarea
                value={form.mediaLinks}
                onChange={(event) => setForm((prev) => ({ ...prev, mediaLinks: event.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.mapAddress}</label>
              <input
                value={form.mapAddress}
                onChange={(event) => setForm((prev) => ({ ...prev, mapAddress: event.target.value }))}
                placeholder="Alatau City"
              />
            </div>
            <div className="form-field">
              <label>{t.mapLat}</label>
              <input
                type="number"
                step="0.000001"
                value={form.mapLat}
                onChange={(event) => setForm((prev) => ({ ...prev, mapLat: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.mapLng}</label>
              <input
                type="number"
                step="0.000001"
                value={form.mapLng}
                onChange={(event) => setForm((prev) => ({ ...prev, mapLng: event.target.value }))}
              />
            </div>
          </div>

          <p className="muted" style={{ marginTop: 10 }}>{t.mapHint}</p>

          <div className="plot-actions" style={{ marginTop: 14 }}>
            <button className="btn btn-ghost" type="button" onClick={() => void locateAddress()} disabled={locating}>
              {locating ? t.locating : t.findCoords}
            </button>
            {googleMapUrl ? (
              <a href={googleMapUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
                {t.openGoogleMap}
              </a>
            ) : null}
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? t.submitting : t.submit}
            </button>
            <Link className="btn btn-ghost" href="/projects">
              {t.openProjects}
            </Link>
          </div>
        </form>
      </section>

      {result ? (
        <section className="section card">
          <strong>
            {result.data.id}. {t.success}
          </strong>
          <p className="muted" style={{ marginTop: 6 }}>
            {t.status}: {result.data.status}. {t.readiness}: {result.readinessScore}/100.
          </p>
          <div className="plot-actions" style={{ marginTop: 12 }}>
            <Link className="btn btn-primary" href="/projects">
              {t.openProjects}
            </Link>
            <Link className="btn btn-ghost" href="/cabinet/investor">
              {t.openInvestorCabinet}
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
