"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { currency } from "@/lib/ui";
import { Plot } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

function toFormNumber(value: number | undefined) {
  return value === undefined ? "" : String(value);
}

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

const MAX_MEDIA_UPLOAD_BYTES = 4 * 1024 * 1024;
const PANORAMA_MARKER = "#panorama360";
const COVER_MARKER = "#cover16x9";

function markPanoramaUrl(url: string) {
  return url.includes(PANORAMA_MARKER) ? url : `${url}${PANORAMA_MARKER}`;
}

function markCoverUrl(url: string) {
  return url.includes(COVER_MARKER) ? url : `${url}${COVER_MARKER}`;
}

function cleanMediaUrl(url: string) {
  return url.replace(PANORAMA_MARKER, "").replace(COVER_MARKER, "");
}

function isCoverUrl(url: string) {
  return url.includes(COVER_MARKER);
}

function isPanoramaUrl(url: string) {
  return url.includes(PANORAMA_MARKER);
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(cleanMediaUrl(url));
}

function isAllowedMediaType(file: File) {
  return file.type.startsWith("image/") || file.type.startsWith("video/");
}

export function OwnerDashboard() {
  const { lang } = useCurrentLanguage();
  const [ownerPlots, setOwnerPlots] = useState<Plot[]>([]);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    district: "",
    purpose: "",
    area: "",
    price: "",
    roi: "",
    irr: "",
    distanceCenterKm: "",
    legalOwnerType: "",
    hasUtilities: true,
    description: "",
    mapAddress: "",
    mapLat: "",
    mapLng: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editMediaUrls, setEditMediaUrls] = useState<string[]>([]);
  const [uploadingEditMedia, setUploadingEditMedia] = useState(false);

  const t = pickLang(lang, {
    EN: {
      ownerStatus: "Owner status",
      verification: "Verification",
      verified: "Verified",
      activePlots: "Active owner plots",
      moderationQueue: "Moderation queue",
      addPlot: "Add plot",
      addProject: "Add project",
      pricing: "Pricing plans",
      analytics: "Owner analytics",
      views: "Total views",
      leads: "Generated leads",
      conversion: "Lead conversion to dialogue",
      tips:
        "Improve title clarity and document completeness to speed up moderation and increase lead quality.",
      listings: "Owner listings",
      listingsSub: "Self-service listings with moderation status and performance metrics.",
      title: "Title",
      price: "Price",
      status: "Status",
      action: "Action",
      open: "Open",
      edit: "Edit",
      editTitle: "Edit land listing",
      editSub: "Changes are sent back to moderation and become active after admin approval.",
      saveChanges: "Submit changes",
      cancel: "Cancel",
      changesSubmitted: "Changes submitted for admin moderation.",
      editError: "Failed to submit changes.",
      district: "District",
      purpose: "Purpose",
      area: "Area (ha)",
      roi: "ROI (%)",
      irr: "IRR (%)",
      distance: "Distance to center (km)",
      ownerType: "Owner type",
      utilities: "Utilities confirmed",
      description: "Change note / description",
      mapAddress: "Map address",
      mapLat: "Latitude",
      mapLng: "Longitude",
      coverSection: "Cover photo 16:9",
      coverHint: "Replace or remove the land listing cover. Recommended ratio: 16:9.",
      mediaSection: "Land photos and videos",
      mediaHint: "Add new photos or videos. Remove old items before submitting if they should disappear.",
      panoramaSection: "360 panorama photos",
      panoramaHint: "Add equirectangular 360 photos for the land detail page.",
      mediaUploading: "Uploading media...",
      uploadedMedia: "Current media",
      openMedia: "Open",
      removeMedia: "Remove",
      uploadFailed: "Some media could not be uploaded.",
      uploadTooLarge: "File is too large for current upload mode (max 4 MB per file).",
      uploadInvalidType: "Only image/video files are allowed.",
      waitMediaUpload: "Please wait until media upload is complete.",
      yes: "Yes",
      no: "No",
      noPlots: "No owner plots yet.",
    },
    RU: {
      ownerStatus: "Статус собственника",
      verification: "Верификация",
      verified: "Подтвержден",
      activePlots: "Активные участки",
      moderationQueue: "Очередь модерации",
      addPlot: "Добавить участок",
      addProject: "Добавить проект",
      pricing: "Тарифы",
      analytics: "Аналитика собственника",
      views: "Просмотры",
      leads: "Лиды",
      conversion: "Конверсия лида в диалог",
      tips:
        "Повышайте качество заголовка и полноту документов, чтобы ускорить модерацию и улучшить лиды.",
      listings: "Листинги собственника",
      listingsSub: "Самостоятельные листинги со статусом модерации и метриками эффективности.",
      title: "Название",
      price: "Цена",
      status: "Статус",
      action: "Действие",
      open: "Открыть",
      edit: "Изменить",
      editTitle: "Редактирование земли",
      editSub: "Изменения снова отправляются на модерацию и станут активными после принятия админом.",
      saveChanges: "Отправить изменения",
      cancel: "Отмена",
      changesSubmitted: "Изменения отправлены на модерацию админам.",
      editError: "Не удалось отправить изменения.",
      district: "Район",
      purpose: "Назначение",
      area: "Площадь (га)",
      roi: "ROI (%)",
      irr: "IRR (%)",
      distance: "Расстояние до центра (км)",
      ownerType: "Тип владельца",
      utilities: "Коммуникации подтверждены",
      description: "Описание изменений",
      mapAddress: "Адрес на карте",
      mapLat: "Широта",
      mapLng: "Долгота",
      coverSection: "Фото обложки 16:9",
      coverHint: "Замените или удалите обложку земли. Рекомендуемое соотношение: 16:9.",
      mediaSection: "Фото и видео земли",
      mediaHint: "Добавьте новые фото или видео. Старые файлы можно удалить перед отправкой.",
      panoramaSection: "360-панорамы земли",
      panoramaHint: "Добавьте equirectangular 360 фото для страницы участка.",
      mediaUploading: "Загрузка медиа...",
      uploadedMedia: "Текущие медиа",
      openMedia: "Открыть",
      removeMedia: "Удалить",
      uploadFailed: "Часть медиа не удалось загрузить.",
      uploadTooLarge: "Файл слишком большой для текущей загрузки (максимум 4 МБ на файл).",
      uploadInvalidType: "Разрешены только файлы изображений и видео.",
      waitMediaUpload: "Дождитесь завершения загрузки медиа.",
      yes: "Да",
      no: "Нет",
      noPlots: "Пока нет участков собственника.",
    },
    KZ: {
      ownerStatus: "Жер иесі статусы",
      verification: "Верификация",
      verified: "Расталған",
      activePlots: "Белсенді учаскелер",
      moderationQueue: "Модерация кезегі",
      addPlot: "Учаске қосу",
      addProject: "Жоба қосу",
      pricing: "Тарифтер",
      analytics: "Жер иесі аналитикасы",
      views: "Қаралым саны",
      leads: "Лидтер",
      conversion: "Лидтен диалогқа конверсия",
      tips:
        "Модерацияны жылдамдату және лид сапасын арттыру үшін тақырып пен құжат толықтығын жақсартыңыз.",
      listings: "Жер иесі листингтері",
      listingsSub: "Модерация статусы және тиімділік метрикалары бар self-service листингтер.",
      title: "Атауы",
      price: "Бағасы",
      status: "Статусы",
      action: "Әрекет",
      open: "Ашу",
      edit: "Өзгерту",
      editTitle: "Жер листингін өзгерту",
      editSub: "Өзгерістер қайта модерацияға жіберіледі және әкім мақұлдағаннан кейін қабылданады.",
      saveChanges: "Өзгерістерді жіберу",
      cancel: "Болдырмау",
      changesSubmitted: "Өзгерістер әкім модерациясына жіберілді.",
      editError: "Өзгерістерді жіберу сәтсіз.",
      district: "Аудан",
      purpose: "Мақсаты",
      area: "Аумағы (га)",
      roi: "ROI (%)",
      irr: "IRR (%)",
      distance: "Орталыққа дейінгі қашықтық (км)",
      ownerType: "Иесі түрі",
      utilities: "Коммуникация расталған",
      description: "Өзгеріс сипаттамасы",
      mapAddress: "Карта мекенжайы",
      mapLat: "Ендік",
      mapLng: "Бойлық",
      coverSection: "16:9 мұқаба фотосы",
      coverHint: "Жер листингінің мұқабасын ауыстырыңыз немесе өшіріңіз. Ұсынылатын қатынас: 16:9.",
      mediaSection: "Жер фото және видеолары",
      mediaHint: "Жаңа фото немесе видео қосыңыз. Жібермес бұрын ескі файлдарды өшіруге болады.",
      panoramaSection: "Жердің 360 панорамалары",
      panoramaHint: "Учаске беті үшін equirectangular 360 фото қосыңыз.",
      mediaUploading: "Медиа жүктелуде...",
      uploadedMedia: "Қазіргі медиа",
      openMedia: "Ашу",
      removeMedia: "Өшіру",
      uploadFailed: "Кейбір медианы жүктеу мүмкін болмады.",
      uploadTooLarge: "Файл ағымдағы жүктеу режимі үшін тым үлкен (әр файлға максимум 4 МБ).",
      uploadInvalidType: "Тек сурет/видео файлдарына рұқсат етіледі.",
      waitMediaUpload: "Медиа жүктеу аяқталғанша күтіңіз.",
      yes: "Иә",
      no: "Жоқ",
      noPlots: "Әзірге жер иесі учаскелері жоқ.",
    },
  });

  const loadOwnerPlots = async () => {
      const response = await fetch("/api/owner/plots");
      const payload = (await response.json()) as { data: Plot[] };
      setOwnerPlots(payload.data);
  };

  useEffect(() => {
    void loadOwnerPlots();
  }, []);

  const startEdit = (plot: Plot) => {
    setEditingPlot(plot);
    setEditForm({
      title: plot.title,
      district: plot.district,
      purpose: plot.purpose,
      area: toFormNumber(plot.area),
      price: toFormNumber(plot.price),
      roi: toFormNumber(plot.roi),
      irr: toFormNumber(plot.irr),
      distanceCenterKm: toFormNumber(plot.distanceCenterKm),
      legalOwnerType: plot.ownerType,
      hasUtilities: !plot.utilities.some((item) => item.toLowerCase().includes("not")),
      description: `Edit request for ${plot.title}`,
      mapAddress: plot.mapAddress ?? "",
      mapLat: toFormNumber(plot.mapLat),
      mapLng: toFormNumber(plot.mapLng),
    });
    setEditMediaUrls(plot.mediaUrls ?? []);
  };

  const cancelPlotEdit = () => {
    setEditingPlot(null);
    setEditMediaUrls([]);
  };

  const uploadMediaFile = async (file: File) => {
    const payload = new FormData();
    payload.append("file", file);

    const response = await fetch("/api/uploads/plot-media", {
      method: "POST",
      body: payload,
    });

    const body = (await response.json()) as UploadMediaResponse;
    if (!response.ok || !body.data?.url) {
      const reason = [body.error, body.detail].filter(Boolean).join(" | ");
      throw new Error(reason || `HTTP ${response.status}`);
    }

    return body.data.url;
  };

  const handleEditCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
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

    setUploadingEditMedia(true);
    try {
      const url = await uploadMediaFile(file);
      setEditMediaUrls((prev) => [markCoverUrl(url), ...prev.filter((item) => !isCoverUrl(item))]);
    } catch (error) {
      window.alert(`${t.uploadFailed}\n${error instanceof Error ? error.message : "Upload failed"}`);
    } finally {
      setUploadingEditMedia(false);
      event.target.value = "";
    }
  };

  const handleEditMediaUpload = async (event: ChangeEvent<HTMLInputElement>, panorama = false) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploadingEditMedia(true);
    const uploaded: string[] = [];
    const failed: string[] = [];

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
        const url = await uploadMediaFile(file);
        uploaded.push(panorama ? markPanoramaUrl(url) : url);
      } catch (error) {
        failed.push(`${file.name}: ${error instanceof Error ? error.message : "Upload failed"}`);
      }
    }

    if (uploaded.length) {
      setEditMediaUrls((prev) => [...prev, ...uploaded]);
    }

    setUploadingEditMedia(false);
    event.target.value = "";

    if (failed.length) {
      window.alert(`${t.uploadFailed}\n${failed.join("\n")}`);
    }
  };

  const submitEdit = async () => {
    if (!editingPlot) return;
    if (uploadingEditMedia) {
      window.alert(t.waitMediaUpload);
      return;
    }

    setSavingEdit(true);
    const response = await fetch(`/api/owner/plots/${editingPlot.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        mediaUrls: editMediaUrls,
      }),
    });
    setSavingEdit(false);

    if (!response.ok) {
      window.alert(t.editError);
      return;
    }

    window.alert(t.changesSubmitted);
    cancelPlotEdit();
    await loadOwnerPlots();
  };

  const views = useMemo(
    () => ownerPlots.reduce((sum, plot) => sum + 180 + Math.round(plot.area * 44), 0),
    [ownerPlots]
  );

  const leads = useMemo(
    () => ownerPlots.reduce((sum, plot) => sum + Math.max(1, Math.round(plot.roi / 4)), 0),
    [ownerPlots]
  );

  const editCoverUrl = useMemo(
    () => editMediaUrls.find((url) => isCoverUrl(url)) ?? null,
    [editMediaUrls]
  );
  const editGalleryUrls = useMemo(
    () => editMediaUrls.filter((url) => !isCoverUrl(url)),
    [editMediaUrls]
  );

  return (
    <>
      <section className="split">
        <div className="card">
          <h3 className="card-title">{t.ownerStatus}</h3>
          <div className="metric-line">
            <span className="muted">{t.verification}</span>
            <strong>{t.verified}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.activePlots}</span>
            <strong>{ownerPlots.length}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.moderationQueue}</span>
            <strong>{ownerPlots.filter((plot) => plot.status === "moderation").length}</strong>
          </div>
          <div className="plot-actions" style={{ marginTop: 12 }}>
            <Link className="btn btn-primary" href="/owner/add-plot">
              {t.addPlot}
            </Link>
            <Link className="btn btn-ghost" href="/projects/submit">
              {t.addProject}
            </Link>
            <Link className="btn btn-ghost" href="/cabinet/projects">
              {lang === "RU" ? "Кабинет проектов" : lang === "KZ" ? "Жоба кабинеті" : "Project cabinet"}
            </Link>
            <Link className="btn btn-ghost" href="/pricing">
              {t.pricing}
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">{t.analytics}</h3>
          <div className="metric-line">
            <span className="muted">{t.views}</span>
            <strong>{views}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.leads}</span>
            <strong>{leads}</strong>
          </div>
          <div className="metric-line">
            <span className="muted">{t.conversion}</span>
            <strong>42%</strong>
          </div>
          <p className="muted">{t.tips}</p>
        </div>
      </section>

      {editingPlot ? (
        <section className="section card">
          <div className="section-title">
            <div>
              <h2>{t.editTitle}</h2>
              <p>{t.editSub}</p>
            </div>
            <span className="badge">{editingPlot.id}</span>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>{t.title}</label>
              <input
                value={editForm.title}
                onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.district}</label>
              <input
                value={editForm.district}
                onChange={(event) => setEditForm((prev) => ({ ...prev, district: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.purpose}</label>
              <input
                value={editForm.purpose}
                onChange={(event) => setEditForm((prev) => ({ ...prev, purpose: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.price}</label>
              <input
                type="number"
                value={editForm.price}
                onChange={(event) => setEditForm((prev) => ({ ...prev, price: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.area}</label>
              <input
                type="number"
                step="0.1"
                value={editForm.area}
                onChange={(event) => setEditForm((prev) => ({ ...prev, area: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.roi}</label>
              <input
                type="number"
                step="0.1"
                value={editForm.roi}
                onChange={(event) => setEditForm((prev) => ({ ...prev, roi: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.irr}</label>
              <input
                type="number"
                step="0.1"
                value={editForm.irr}
                onChange={(event) => setEditForm((prev) => ({ ...prev, irr: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.distance}</label>
              <input
                type="number"
                step="0.1"
                value={editForm.distanceCenterKm}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, distanceCenterKm: event.target.value }))
                }
              />
            </div>
            <div className="form-field">
              <label>{t.ownerType}</label>
              <input
                value={editForm.legalOwnerType}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, legalOwnerType: event.target.value }))
                }
              />
            </div>
            <div className="form-field">
              <label>{t.utilities}</label>
              <select
                value={String(editForm.hasUtilities)}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, hasUtilities: event.target.value === "true" }))
                }
              >
                <option value="true">{t.yes}</option>
                <option value="false">{t.no}</option>
              </select>
            </div>
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.description}</label>
              <textarea
                value={editForm.description}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, description: event.target.value }))
                }
                required
              />
            </div>
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>{t.coverSection}</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingEditMedia}
                onChange={handleEditCoverUpload}
              />
              <p className="muted">{t.coverHint}</p>
              {editCoverUrl ? (
                <div className="uploaded-media-grid uploaded-cover-grid">
                  <div className="uploaded-media-item">
                    <div className="uploaded-media-preview uploaded-cover-preview">
                      <img src={cleanMediaUrl(editCoverUrl)} alt={t.coverSection} />
                    </div>
                    <div className="uploaded-media-actions">
                      <a
                        href={cleanMediaUrl(editCoverUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost"
                      >
                        {t.openMedia}
                      </a>
                      <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={() =>
                          setEditMediaUrls((prev) => prev.filter((item) => !isCoverUrl(item)))
                        }
                      >
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
                disabled={uploadingEditMedia}
                onChange={handleEditMediaUpload}
              />
              <p className="muted">{t.mediaHint}</p>

              <label style={{ marginTop: 10 }}>{t.panoramaSection}</label>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploadingEditMedia}
                onChange={(event) => handleEditMediaUpload(event, true)}
              />
              <p className="muted">{t.panoramaHint}</p>
              {uploadingEditMedia ? <p className="muted">{t.mediaUploading}</p> : null}

              {editGalleryUrls.length ? (
                <>
                  <p className="muted">
                    {t.uploadedMedia}: {editGalleryUrls.length}
                  </p>
                  <div className="uploaded-media-grid">
                    {editGalleryUrls.map((url, index) => {
                      const cleanUrl = cleanMediaUrl(url);
                      const isPanorama = isPanoramaUrl(url);
                      return (
                        <div className="uploaded-media-item" key={`${url}-${index}`}>
                          <div className="uploaded-media-preview">
                            {isVideoUrl(url) ? (
                              <video src={cleanUrl} controls preload="metadata" />
                            ) : (
                              <img
                                src={cleanUrl}
                                alt={`${t.mediaSection} ${index + 1}`}
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
                                setEditMediaUrls((prev) => prev.filter((item) => item !== url))
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
                value={editForm.mapAddress}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, mapAddress: event.target.value }))
                }
              />
            </div>
            <div className="form-field">
              <label>{t.mapLat}</label>
              <input
                type="number"
                step="0.000001"
                value={editForm.mapLat}
                onChange={(event) => setEditForm((prev) => ({ ...prev, mapLat: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>{t.mapLng}</label>
              <input
                type="number"
                step="0.000001"
                value={editForm.mapLng}
                onChange={(event) => setEditForm((prev) => ({ ...prev, mapLng: event.target.value }))}
              />
            </div>
          </div>

          <div className="plot-actions" style={{ marginTop: 12 }}>
            <button
              className="btn btn-primary"
              type="button"
              disabled={savingEdit || uploadingEditMedia}
              onClick={submitEdit}
            >
              {t.saveChanges}
            </button>
            <button className="btn btn-ghost" type="button" onClick={cancelPlotEdit}>
              {t.cancel}
            </button>
          </div>
        </section>
      ) : null}

      <section className="section card">
        <div className="section-title">
          <h2>{t.listings}</h2>
          <p>{t.listingsSub}</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t.title}</th>
                <th>{t.price}</th>
                <th>{t.status}</th>
                <th>{t.views}</th>
                <th>{t.leads}</th>
                <th>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {ownerPlots.length ? (
                ownerPlots.map((plot) => (
                  <tr key={plot.id}>
                    <td>{plot.id}</td>
                    <td>{plot.title}</td>
                    <td>{currency(plot.price)}</td>
                    <td>
                      <StatusBadge status={plot.status} />
                    </td>
                    <td>{180 + Math.round(plot.area * 44)}</td>
                    <td>{Math.max(1, Math.round(plot.roi / 4))}</td>
                    <td>
                      <div className="plot-actions">
                        <Link className="btn btn-ghost" href={`/plots/${plot.id}`}>
                          {t.open}
                        </Link>
                        <button className="btn btn-ghost" type="button" onClick={() => startEdit(plot)}>
                          {t.edit}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>{t.noPlots}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}


