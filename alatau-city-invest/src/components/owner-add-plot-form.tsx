"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { ALATAU_BOUNDS, isInsideAlatauBounds } from "@/lib/map-geo";

type CreateResult = {
  data: { id: string; status: string };
  qualityScore: number;
};

type ApiErrorResponse = {
  error?: string;
  detail?: string;
};

type UploadedMedia = {
  url: string;
  pathname?: string;
  size?: number;
  contentType?: string;
  originalName?: string;
};

type UploadMediaResponse = {
  data?: UploadedMedia;
  error?: string;
  detail?: string;
};

const MAX_MEDIA_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB safe limit for Vercel function upload
const PANORAMA_MARKER = "#panorama360";
const COVER_MARKER = "#cover16x9";

function parseNumberValue(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return undefined;
  const next = Number(normalized);
  return Number.isFinite(next) ? next : undefined;
}

function markPanoramaUrl(url: string) {
  return url.includes(PANORAMA_MARKER) ? url : `${url}${PANORAMA_MARKER}`;
}

function markCoverUrl(url: string) {
  return url.includes(COVER_MARKER) ? url : `${url}${COVER_MARKER}`;
}

function cleanMediaUrl(url: string) {
  return url.replace(PANORAMA_MARKER, "").replace(COVER_MARKER, "");
}

function isPanoramaUrl(url: string, contentType?: string) {
  return url.includes(PANORAMA_MARKER) || contentType === "image/panorama360";
}

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
    mapAddress: "",
    mapLat: "",
    mapLng: "",
  });

  const [result, setResult] = useState<CreateResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [coverMedia, setCoverMedia] = useState<UploadedMedia | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

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
      mapAddress: "Map address or place",
      mapLat: "Latitude",
      mapLng: "Longitude",
      openGoogleMap: "Open in Google Maps",
      mapHint: `Alatau bounds: lat ${ALATAU_BOUNDS.minLat}..${ALATAU_BOUNDS.maxLat}, lng ${ALATAU_BOUNDS.minLng}..${ALATAU_BOUNDS.maxLng}.`,
      mediaSection: "Plot media (photo/video)",
      mediaHint: "Upload files to Vercel Blob. Public links will be saved to this listing.",
      coverSection: "Cover photo 16:9 (optional)",
      coverHint: "Upload one horizontal image for the listing cover. Recommended ratio: 16:9.",
      panoramaSection: "360 panorama photos",
      panoramaHint: "Upload equirectangular 360 photos. They will appear separately on the plot page.",
      mediaUploading: "Uploading files...",
      mediaUploaded: "Uploaded files",
      removeMedia: "Remove",
      openMedia: "Open",
      uploadFailed: "Some files could not be uploaded.",
      uploadTooLarge: "File is too large for current upload mode (max 4 MB per file).",
      uploadInvalidType: "Only image/video files are allowed.",
      waitMediaUpload: "Please wait until media upload is complete.",
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
      invalidArea: "Area must be a valid number greater than 0.",
      invalidPrice: "Price must be a valid number and at least 10,000 USD.",
      invalidCoordinatesPair: "Enter both latitude and longitude, or leave both empty.",
      invalidCoordinatesRange: `Coordinates must be inside Alatau bounds: lat ${ALATAU_BOUNDS.minLat}..${ALATAU_BOUNDS.maxLat}, lng ${ALATAU_BOUNDS.minLng}..${ALATAU_BOUNDS.maxLng}.`,
      unauthorized: "Your session is expired. Please sign in again.",
      forbidden: "Only owner/admin accounts can submit land listings.",
      errorDetailsTitle: "Server returned:",
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
      mapAddress: "Адрес или точка на карте",
      mapLat: "Широта",
      mapLng: "Долгота",
      openGoogleMap: "Открыть в Google Maps",
      mapHint: `Границы Алатау: широта ${ALATAU_BOUNDS.minLat}..${ALATAU_BOUNDS.maxLat}, долгота ${ALATAU_BOUNDS.minLng}..${ALATAU_BOUNDS.maxLng}.`,
      mediaSection: "Медиа участка (фото/видео)",
      mediaHint: "Файлы загружаются в Vercel Blob. В листинге сохраняются публичные ссылки.",
      coverSection: "Фото обложки 16:9 (необязательно)",
      coverHint: "Загрузите одно горизонтальное изображение для обложки листинга. Рекомендуемое соотношение: 16:9.",
      panoramaSection: "360-панорамы участка",
      panoramaHint: "Загрузите equirectangular 360 фото. Они будут отдельно показаны на странице участка.",
      mediaUploading: "Загрузка файлов...",
      mediaUploaded: "Загруженные файлы",
      removeMedia: "Удалить",
      openMedia: "Открыть",
      uploadFailed: "Часть файлов не удалось загрузить.",
      uploadTooLarge: "Файл слишком большой для текущей загрузки (максимум 4 МБ на файл).",
      uploadInvalidType: "Разрешены только файлы изображений и видео.",
      waitMediaUpload: "Дождитесь завершения загрузки медиа.",
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
      invalidArea: "Площадь должна быть числом больше 0.",
      invalidPrice: "Цена должна быть числом не меньше 10 000 USD.",
      invalidCoordinatesPair: "Укажите и широту, и долготу, либо оставьте оба поля пустыми.",
      invalidCoordinatesRange: `Координаты должны быть в пределах Алатау: широта ${ALATAU_BOUNDS.minLat}..${ALATAU_BOUNDS.maxLat}, долгота ${ALATAU_BOUNDS.minLng}..${ALATAU_BOUNDS.maxLng}.`,
      unauthorized: "Сессия истекла. Выполните вход заново.",
      forbidden: "Публиковать участки могут только владелец или администратор.",
      errorDetailsTitle: "Сервер вернул:",
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
      mapAddress: "Картадағы мекенжай немесе нүкте",
      mapLat: "Ендік",
      mapLng: "Бойлық",
      openGoogleMap: "Google Maps-те ашу",
      mapHint: `Alatau шекарасы: ендік ${ALATAU_BOUNDS.minLat}..${ALATAU_BOUNDS.maxLat}, бойлық ${ALATAU_BOUNDS.minLng}..${ALATAU_BOUNDS.maxLng}.`,
      mediaSection: "Учаске медиасы (фото/видео)",
      mediaHint: "Файлдар Vercel Blob-қа жүктеледі. Листингте ашық сілтемелер сақталады.",
      coverSection: "16:9 мұқаба фотосы (міндетті емес)",
      coverHint: "Листинг мұқабасына бір көлденең сурет жүктеңіз. Ұсынылатын қатынас: 16:9.",
      panoramaSection: "Учаскенің 360 панорамалары",
      panoramaHint: "Equirectangular 360 фото жүктеңіз. Олар учаске бетінде бөлек көрсетіледі.",
      mediaUploading: "Файлдар жүктелуде...",
      mediaUploaded: "Жүктелген файлдар",
      removeMedia: "Өшіру",
      openMedia: "Ашу",
      uploadFailed: "Кейбір файлдарды жүктеу мүмкін болмады.",
      uploadTooLarge: "Файл ағымдағы жүктеу режимі үшін тым үлкен (әр файлға максимум 4 МБ).",
      uploadInvalidType: "Тек сурет/видео файлдарына рұқсат етіледі.",
      waitMediaUpload: "Медиа жүктеу аяқталғанша күтіңіз.",
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
      invalidArea: "Аумақ 0-ден үлкен дұрыс сан болуы керек.",
      invalidPrice: "Баға дұрыс сан болып, кемі 10 000 USD болуы керек.",
      invalidCoordinatesPair: "Ендік пен бойлықты бірге енгізіңіз немесе екеуін де бос қалдырыңыз.",
      invalidCoordinatesRange: `Координаттар Alatau шекарасында болуы керек: ендік ${ALATAU_BOUNDS.minLat}..${ALATAU_BOUNDS.maxLat}, бойлық ${ALATAU_BOUNDS.minLng}..${ALATAU_BOUNDS.maxLng}.`,
      unauthorized: "Сессия уақыты аяқталды. Қайта кіріңіз.",
      forbidden: "Учаске жариялауды тек иесі немесе әкімші жасай алады.",
      errorDetailsTitle: "Сервер жауабы:",
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
    if (form.description.trim().length > 120) next += 16;
    if (form.mapLat.trim().length > 0 && form.mapLng.trim().length > 0) next += 2;
    if (uploadedMedia.length > 0 || coverMedia) next += 2;
    return Math.min(100, next);
  }, [coverMedia, form, uploadedMedia.length]);

  const googleMapUrl = useMemo(() => {
    if (form.mapLat && form.mapLng) {
      return `https://www.google.com/maps?q=${encodeURIComponent(`${form.mapLat},${form.mapLng}`)}`;
    }
    if (form.mapAddress.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.mapAddress.trim())}`;
    }
    return null;
  }, [form.mapAddress, form.mapLat, form.mapLng]);

  const isVideoUrl = (url: string, contentType?: string) => {
    if (contentType?.startsWith("video/")) return true;
    return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
  };

  const isAllowedMediaType = (file: File) =>
    file.type.startsWith("image/") || file.type.startsWith("video/");

  const handleMediaUpload = async (event: ChangeEvent<HTMLInputElement>, panorama = false) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploadingMedia(true);
    const failed: string[] = [];
    const uploaded: UploadedMedia[] = [];

    for (const file of files) {
      if (panorama && !file.type.startsWith("image/")) {
        failed.push(`${file.name}: ${t.uploadInvalidType}`);
        continue;
      }

      if (!panorama && !isAllowedMediaType(file)) {
        failed.push(`${file.name}: ${t.uploadInvalidType}`);
        continue;
      }

      if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
        failed.push(`${file.name}: ${t.uploadTooLarge}`);
        continue;
      }

      try {
        const payload = new FormData();
        payload.append("file", file);

        const response = await fetch("/api/uploads/plot-media", {
          method: "POST",
          body: payload,
        });

        const body = (await response.json()) as UploadMediaResponse;
        if (!response.ok || !body.data?.url) {
          const reason = [body.error, body.detail].filter(Boolean).join(" | ");
          failed.push(reason ? `${file.name}: ${reason}` : `${file.name}: HTTP ${response.status}`);
          continue;
        }

        uploaded.push(
          panorama
            ? {
                ...body.data,
                url: markPanoramaUrl(body.data.url),
                contentType: "image/panorama360",
              }
            : body.data
        );
      } catch {
        failed.push(`${file.name}: network error`);
      }
    }

    if (uploaded.length) {
      setUploadedMedia((prev) => [...prev, ...uploaded]);
    }

    setUploadingMedia(false);
    event.target.value = "";

    if (failed.length) {
      window.alert(`${t.uploadFailed}\n${failed.join("\n")}`);
    }
  };

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert(t.uploadInvalidType);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
      window.alert(t.uploadTooLarge);
      event.target.value = "";
      return;
    }

    setUploadingMedia(true);

    try {
      const payload = new FormData();
      payload.append("file", file);

      const response = await fetch("/api/uploads/plot-media", {
        method: "POST",
        body: payload,
      });

      const body = (await response.json()) as UploadMediaResponse;
      if (!response.ok || !body.data?.url) {
        const reason = [body.error, body.detail].filter(Boolean).join(" | ");
        window.alert(reason ? `${t.uploadFailed}\n${reason}` : t.uploadFailed);
        return;
      }

      setCoverMedia({
        ...body.data,
        url: markCoverUrl(body.data.url),
      });
    } catch {
      window.alert(t.uploadFailed);
    } finally {
      setUploadingMedia(false);
      event.target.value = "";
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (uploadingMedia) {
      window.alert(t.waitMediaUpload);
      return;
    }
    setSaving(true);

    const area = parseNumberValue(form.area);
    const price = parseNumberValue(form.price);
    const roi = parseNumberValue(form.roi);
    const irr = parseNumberValue(form.irr);
    const distanceCenterKm = parseNumberValue(form.distanceCenterKm);
    const mapLat = parseNumberValue(form.mapLat);
    const mapLng = parseNumberValue(form.mapLng);
    const hasMapLat = mapLat !== undefined;
    const hasMapLng = mapLng !== undefined;

    if (area === undefined || area <= 0) {
      setSaving(false);
      window.alert(t.invalidArea);
      return;
    }

    if (price === undefined || price < 10000) {
      setSaving(false);
      window.alert(t.invalidPrice);
      return;
    }

    if (hasMapLat !== hasMapLng) {
      setSaving(false);
      window.alert(t.invalidCoordinatesPair);
      return;
    }

    if (hasMapLat && hasMapLng && !isInsideAlatauBounds(mapLat, mapLng)) {
      setSaving(false);
      window.alert(t.invalidCoordinatesRange);
      return;
    }

    const response = await fetch("/api/owner/plots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        cadastral: form.cadastral,
        district: form.district,
        purpose: form.purpose,
        area,
        price,
        roi,
        irr,
        distanceCenterKm,
        legalOwnerType: form.legalOwnerType,
        hasUtilities: form.hasUtilities,
        description: form.description,
        mediaUrls: [...(coverMedia ? [coverMedia.url] : []), ...uploadedMedia.map((item) => item.url)],
        mapAddress: form.mapAddress || undefined,
        mapLat,
        mapLng,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      let details = "";
      try {
        const payload = (await response.json()) as ApiErrorResponse;
        const parts = [payload.error, payload.detail].filter((part) => Boolean(part)) as string[];
        details = parts.join(" | ");
      } catch {
        details = "";
      }

      if (response.status === 401) {
        window.alert(t.unauthorized);
        return;
      }

      if (response.status === 403) {
        window.alert(t.forbidden);
        return;
      }

      if (details) {
        window.alert(`${t.submitError}\n${t.errorDetailsTitle} [${response.status}] ${details}`);
        return;
      }

      window.alert(`${t.submitError}\n${t.errorDetailsTitle} [${response.status}]`);
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
      mapAddress: "",
      mapLat: "",
      mapLng: "",
    });
    setUploadedMedia([]);
    setCoverMedia(null);
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
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.coverSection}</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingMedia}
                onChange={handleCoverUpload}
              />
              <p className="muted">{t.coverHint}</p>
              {coverMedia ? (
                <div className="uploaded-media-grid uploaded-cover-grid">
                  <div className="uploaded-media-item">
                    <div className="uploaded-media-preview uploaded-cover-preview">
                      <img src={cleanMediaUrl(coverMedia.url)} alt={coverMedia.originalName || "cover"} />
                    </div>
                    <div className="uploaded-media-actions">
                      <a
                        href={cleanMediaUrl(coverMedia.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost"
                      >
                        {t.openMedia}
                      </a>
                      <button className="btn btn-ghost" type="button" onClick={() => setCoverMedia(null)}>
                        {t.removeMedia}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <label style={{ marginTop: 10 }}>{t.mediaSection}</label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                disabled={uploadingMedia}
                onChange={handleMediaUpload}
              />
              <p className="muted">{t.mediaHint}</p>
              <label style={{ marginTop: 10 }}>{t.panoramaSection}</label>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploadingMedia}
                onChange={(event) => handleMediaUpload(event, true)}
              />
              <p className="muted">{t.panoramaHint}</p>
              {uploadingMedia ? <p className="muted">{t.mediaUploading}</p> : null}

              {uploadedMedia.length ? (
                <>
                  <p className="muted">{t.mediaUploaded}: {uploadedMedia.length}</p>
                  <div className="uploaded-media-grid">
                    {uploadedMedia.map((item, index) => {
                      const isVideo = isVideoUrl(item.url, item.contentType);
                      const cleanUrl = cleanMediaUrl(item.url);
                      const isPanorama = isPanoramaUrl(item.url, item.contentType);
                      return (
                        <div className="uploaded-media-item" key={`${item.url}-${index}`}>
                          <div className="uploaded-media-preview">
                            {isVideo ? (
                              <video src={cleanUrl} controls preload="metadata" />
                            ) : (
                              <img
                                src={cleanUrl}
                                alt={item.originalName || `media-${index + 1}`}
                                className={isPanorama ? "panorama-thumb" : undefined}
                              />
                            )}
                          </div>
                          <div className="uploaded-media-actions">
                            <a href={cleanUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
                              {t.openMedia}
                            </a>
                            <button
                              className="btn btn-ghost"
                              type="button"
                              onClick={() =>
                                setUploadedMedia((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
                              }
                            >
                              {t.removeMedia}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
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
            {googleMapUrl ? (
              <a href={googleMapUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
                {t.openGoogleMap}
              </a>
            ) : null}
            <button className="btn btn-primary" type="submit" disabled={saving || uploadingMedia}>
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
