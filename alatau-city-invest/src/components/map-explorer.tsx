"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { localizePlot, localizePricePresetLabel, translatePurpose } from "@/lib/i18n-content";
import { statusColor, currency } from "@/lib/ui";
import { Plot } from "@/lib/types";

type FilterState = {
  purpose: string;
  status: string;
  risk: string;
  price: string;
  sort?: string;
};

type ApiPayload = {
  data: Plot[];
  meta?: {
    purposes: string[];
    pricePresets: { key: string; label: string }[];
  };
};

export function MapExplorer() {
  const { lang } = useCurrentLanguage();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [pricePresets, setPricePresets] = useState<{ key: string; label: string }[]>([]);
  const [selected, setSelected] = useState<Plot | null>(null);
  const [loading, setLoading] = useState(true);

  const t = pickLang(lang, {
    EN: {
      mapFilters: "Map filters",
      purpose: "Purpose",
      price: "Price",
      status: "Status",
      riskProfile: "Risk profile",
      anyPurpose: "Any purpose",
      anyStatus: "Any status",
      available: "Available",
      reserved: "Reserved",
      deal: "In deal",
      moderation: "Moderation",
      sold: "Sold",
      legalIssue: "Legal issue",
      anyRisk: "Any risk",
      low: "Low",
      medium: "Medium",
      high: "High",
      loading: "Loading map...",
      noPlots: "No plots match current filters.",
      priceLabel: "Price",
      area: "Area",
      roi: "ROI",
      open: "Open plot",
      apply: "Apply",
      selectMarker: "Select a marker to open preview.",
      selectZoneHint: "Click a marker on the map or pick a plot from the list below.",
      mapAlt: "Alatau City vector map",
    },
    RU: {
      mapFilters: "Фильтры карты",
      purpose: "Назначение",
      price: "Цена",
      status: "Статус",
      riskProfile: "Профиль риска",
      anyPurpose: "Любое назначение",
      anyStatus: "Любой статус",
      available: "Доступен",
      reserved: "Резерв",
      deal: "В сделке",
      moderation: "Модерация",
      sold: "Продан",
      legalIssue: "Юр. проблема",
      anyRisk: "Любой риск",
      low: "Низкий",
      medium: "Средний",
      high: "Высокий",
      loading: "Загрузка карты...",
      noPlots: "По текущим фильтрам участков нет.",
      priceLabel: "Цена",
      area: "Площадь",
      roi: "ROI",
      open: "Открыть участок",
      apply: "Подать заявку",
      selectMarker: "Выберите маркер, чтобы открыть превью.",
      selectZoneHint: "Нажмите на маркер на карте или выберите участок в списке ниже.",
      mapAlt: "Векторная карта Alatau City",
    },
    KZ: {
      mapFilters: "Карта сүзгілері",
      purpose: "Мақсаты",
      price: "Бағасы",
      status: "Статусы",
      riskProfile: "Тәуекел профилі",
      anyPurpose: "Кез келген мақсат",
      anyStatus: "Кез келген статус",
      available: "Қолжетімді",
      reserved: "Резерв",
      deal: "Мәміледе",
      moderation: "Модерация",
      sold: "Сатылған",
      legalIssue: "Заңдық мәселе",
      anyRisk: "Кез келген тәуекел",
      low: "Төмен",
      medium: "Орта",
      high: "Жоғары",
      loading: "Карта жүктелуде...",
      noPlots: "Ағымдағы сүзгілерге сәйкес учаске табылмады.",
      priceLabel: "Бағасы",
      area: "Аумағы",
      roi: "ROI",
      open: "Учаскені ашу",
      apply: "Өтінім беру",
      selectMarker: "Превью ашу үшін маркерді таңдаңыз.",
      selectZoneHint: "Картадағы маркерді басыңыз немесе төмендегі тізімнен учаскені таңдаңыз.",
      mapAlt: "Alatau City векторлық картасы",
    },
    CN: {
      mapFilters: "地图筛选",
      purpose: "用途",
      price: "价格",
      status: "状态",
      riskProfile: "风险画像",
      anyPurpose: "任意用途",
      anyStatus: "任意状态",
      available: "可用",
      reserved: "已预留",
      deal: "交易中",
      moderation: "审核中",
      sold: "已售出",
      legalIssue: "法律问题",
      anyRisk: "任意风险",
      low: "低",
      medium: "中",
      high: "高",
      loading: "地图加载中...",
      noPlots: "当前筛选条件下没有匹配地块。",
      priceLabel: "价格",
      area: "面积",
      roi: "ROI",
      open: "打开地块",
      apply: "提交申请",
      selectMarker: "选择地图标记以打开预览。",
      selectZoneHint: "点击地图标记，或从下方列表选择地块。",
      mapAlt: "Alatau City 矢量地图",
    },
  });

  const [filters, setFilters] = useState<FilterState>({
    purpose: "all",
    status: "all",
    risk: "all",
    price: "all",
  });

  const statusLabels = useMemo(
    () => ({
      available: t.available,
      reserved: t.reserved,
      deal: t.deal,
      moderation: t.moderation,
      sold: t.sold,
      legal_issue: t.legalIssue,
    }),
    [t]
  );

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/plots?${query}`);
      const payload = (await res.json()) as ApiPayload;
      setPlots(payload.data);
      setPurposes(payload.meta?.purposes ?? []);
      setPricePresets(payload.meta?.pricePresets ?? []);
      setSelected(payload.data[0] ?? null);
      setLoading(false);
    }

    void load();
  }, [query]);

  return (
    <div className="map-explorer-layout">
      <section className="map-layout">
      <aside className="map-panel">
        <h3 className="card-title">{t.mapFilters}</h3>
        <div className="form-field">
          <label>{t.purpose}</label>
          <select
            value={filters.purpose}
            onChange={(event) => setFilters((prev) => ({ ...prev, purpose: event.target.value }))}
          >
            <option value="all">{t.anyPurpose}</option>
            {purposes.map((purpose) => (
              <option key={purpose} value={purpose}>
                {translatePurpose(lang, purpose)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>{t.price}</label>
          <select
            value={filters.price}
            onChange={(event) => setFilters((prev) => ({ ...prev, price: event.target.value }))}
          >
            {pricePresets.map((preset) => (
              <option key={preset.key} value={preset.key}>
                {localizePricePresetLabel(lang, preset.key, preset.label)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>{t.status}</label>
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="all">{t.anyStatus}</option>
            <option value="available">{t.available}</option>
            <option value="reserved">{t.reserved}</option>
            <option value="deal">{t.deal}</option>
            <option value="moderation">{t.moderation}</option>
            <option value="sold">{t.sold}</option>
            <option value="legal_issue">{t.legalIssue}</option>
          </select>
        </div>

        <div className="form-field">
          <label>{t.riskProfile}</label>
          <select
            value={filters.risk}
            onChange={(event) => setFilters((prev) => ({ ...prev, risk: event.target.value }))}
          >
            <option value="all">{t.anyRisk}</option>
            <option value="low">{t.low}</option>
            <option value="medium">{t.medium}</option>
            <option value="high">{t.high}</option>
          </select>
        </div>
      </aside>

      <section className="map-content">
        <div className="map-board">
          <img className="map-base" src="/alatau-map.svg" alt={t.mapAlt} />
          <div className="map-overlay" />
          <div className="map-hint">{t.selectZoneHint}</div>
          {loading ? <div className="empty-state map-empty">{t.loading}</div> : null}
          {!loading && !plots.length ? <div className="empty-state map-empty">{t.noPlots}</div> : null}

          {!loading
            ? plots.map((plot) => {
              const displayPlot = localizePlot(lang, plot);
              return (
              <button
                key={plot.id}
                type="button"
                className={`map-marker ${selected?.id === plot.id ? "is-active" : ""}`}
                style={{ left: `${plot.x}%`, top: `${plot.y}%`, background: statusColor[plot.status] }}
                title={displayPlot.title}
                onClick={() => setSelected(plot)}
              />
              );
            })
            : null}
        </div>

        <div className="map-legend">
          {Object.entries(statusLabels).map(([status, label]) => (
            <span className="badge" key={status}>
              <span className="dot" style={{ background: statusColor[status as keyof typeof statusColor] }} />
              {label}
            </span>
          ))}
        </div>

        <div className="list-panel">
          {!plots.length ? (
            <div className="empty-state">{t.noPlots}</div>
          ) : (
            plots.map((plot) => {
              const displayPlot = localizePlot(lang, plot);
              return (
                <div
                  key={plot.id}
                  className={`list-item ${selected?.id === plot.id ? "is-active" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(plot)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(plot);
                    }
                  }}
                >
                  <strong>
                    {plot.id} · {displayPlot.title}
                  </strong>
                  <span className="muted">
                    {currency(plot.price)} · {plot.area} ha · ROI {plot.roi}%
                  </span>
                  <span className="badge">
                    <span className="dot" style={{ background: statusColor[plot.status] }} />
                    {statusLabels[plot.status]}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
      </section>

      <section className="card map-selection-card">
        {selected ? (
          <>
            <h3 className="card-title">{localizePlot(lang, selected).title}</h3>
            <p className="muted">
              {selected.id} · {localizePlot(lang, selected).district} ·{" "}
              {translatePurpose(lang, selected.purpose)}
            </p>
            <div className="metric-line">
              <span className="muted">{t.priceLabel}</span>
              <strong>{currency(selected.price)}</strong>
            </div>
            <div className="metric-line">
              <span className="muted">{t.area}</span>
              <strong>{selected.area} ha</strong>
            </div>
            <div className="metric-line">
              <span className="muted">{t.roi}</span>
              <strong>{selected.roi}%</strong>
            </div>
            <div className="plot-actions" style={{ marginTop: 12 }}>
              <Link className="btn btn-primary" href={`/plots/${selected.id}`}>
                {t.open}
              </Link>
              <Link className="btn btn-accent" href={`/invest?plot=${selected.id}`}>
                {t.apply}
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-state">{t.selectMarker}</div>
        )}
      </section>
    </div>
  );
}
