"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { currency } from "@/lib/ui";
import { Plot } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

function toFormNumber(value: number | undefined) {
  return value === undefined ? "" : String(value);
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
  };

  const submitEdit = async () => {
    if (!editingPlot) return;

    setSavingEdit(true);
    const response = await fetch(`/api/owner/plots/${editingPlot.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setSavingEdit(false);

    if (!response.ok) {
      window.alert(t.editError);
      return;
    }

    window.alert(t.changesSubmitted);
    setEditingPlot(null);
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
            <button className="btn btn-primary" type="button" disabled={savingEdit} onClick={submitEdit}>
              {t.saveChanges}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditingPlot(null)}>
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


