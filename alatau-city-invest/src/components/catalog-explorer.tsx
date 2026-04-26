"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { COMPARE_CHANGE_EVENT, emitClientEvent } from "@/lib/client-events";
import { localizePricePresetLabel, translatePurpose } from "@/lib/i18n-content";
import { PlotCard } from "@/components/plot-card";
import { Plot } from "@/lib/types";

type ApiPayload = {
  data: Plot[];
  meta: {
    purposes: string[];
    pricePresets: { key: string; label: string }[];
  };
};

const COMPARE_KEY = "aci_compare";

export function CatalogExplorer() {
  const { lang } = useCurrentLanguage();
  const { status: sessionStatus } = useSession();
  const [filters, setFilters] = useState({
    purpose: "all",
    status: "all",
    risk: "all",
    price: "all",
    sort: "roi_desc",
  });
  const [plots, setPlots] = useState<Plot[]>([]);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [pricePresets, setPricePresets] = useState<{ key: string; label: string }[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const t = pickLang(lang, {
    EN: {
      purpose: "Purpose",
      price: "Price",
      status: "Status",
      risk: "Risk",
      sort: "Sort",
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
      roiDesc: "ROI descending",
      priceAsc: "Price ascending",
      priceDesc: "Price descending",
      riskAsc: "Risk ascending",
      noPlots: "No plots with current filters.",
      selected: "Selected for compare:",
      clear: "Clear",
      openCompare: "Open compare",
      comparePlots: "Compare plots",
      close: "Close",
      submitTitle: "Register land on InvestMap",
      submitText:
        "Have a plot ready for investors? Add cadastral data, price, media, legal details and send it to moderation as a separate land listing.",
      submitLand: "Register land",
      loginSubmitLand: "Sign in to register land",
      openMap: "Open map",
    },
    RU: {
      purpose: "Назначение",
      price: "Цена",
      status: "Статус",
      risk: "Риск",
      sort: "Сортировка",
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
      roiDesc: "ROI по убыванию",
      priceAsc: "Цена по возрастанию",
      priceDesc: "Цена по убыванию",
      riskAsc: "Риск по возрастанию",
      noPlots: "Нет участков по выбранным фильтрам.",
      selected: "Выбрано для сравнения:",
      clear: "Очистить",
      openCompare: "Открыть сравнение",
      comparePlots: "Сравнение участков",
      close: "Закрыть",
      submitTitle: "Зарегистрировать землю на InvestMap",
      submitText:
        "Есть участок для инвесторов? Добавьте кадастровые данные, цену, медиа, юридические детали и отправьте землю на модерацию отдельным листингом.",
      submitLand: "Зарегистрировать землю",
      loginSubmitLand: "Войти для регистрации земли",
      openMap: "Открыть карту",
    },
    KZ: {
      purpose: "Мақсаты",
      price: "Бағасы",
      status: "Статусы",
      risk: "Тәуекел",
      sort: "Сұрыптау",
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
      roiDesc: "ROI кему ретімен",
      priceAsc: "Баға өсу ретімен",
      priceDesc: "Баға кему ретімен",
      riskAsc: "Тәуекел өсу ретімен",
      noPlots: "Таңдалған сүзгілер бойынша учаске жоқ.",
      selected: "Салыстыруға таңдалған:",
      clear: "Тазарту",
      openCompare: "Салыстыруды ашу",
      comparePlots: "Учаскелерді салыстыру",
      close: "Жабу",
      submitTitle: "Жерді InvestMap-та тіркеу",
      submitText:
        "Инвесторларға дайын учаскеңіз бар ма? Кадастр деректерін, бағаны, медиа және заңдық мәліметтерді қосып, жерді бөлек листинг ретінде модерацияға жіберіңіз.",
      submitLand: "Жерді тіркеу",
      loginSubmitLand: "Жер тіркеу үшін кіру",
      openMap: "Картаны ашу",
    },
  });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => params.set(key, value));
    return params.toString();
  }, [filters]);

  const compareRows = useMemo(
    () => plots.filter((plot) => compareIds.includes(plot.id)),
    [plots, compareIds]
  );

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(COMPARE_KEY) ?? "[]") as string[];
    setCompareIds(saved);
  }, []);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/plots?${query}`);
      const payload = (await res.json()) as ApiPayload;
      setPlots(payload.data);
      setPurposes(payload.meta.purposes);
      setPricePresets(payload.meta.pricePresets);
    }

    void load();
  }, [query]);

  useEffect(() => {
    const watcher = () => {
      const saved = JSON.parse(localStorage.getItem(COMPARE_KEY) ?? "[]") as string[];
      setCompareIds(saved);
    };

    window.addEventListener("storage", watcher);
    window.addEventListener(COMPARE_CHANGE_EVENT, watcher);

    return () => {
      window.removeEventListener("storage", watcher);
      window.removeEventListener(COMPARE_CHANGE_EVENT, watcher);
    };
  }, []);

  const clearCompare = () => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify([]));
    setCompareIds([]);
    setShowCompare(false);
    emitClientEvent(COMPARE_CHANGE_EVENT);
  };
  const submitLandHref =
    sessionStatus === "authenticated" ? "/owner/add-plot" : "/login?callbackUrl=/owner/add-plot";

  return (
    <>
      <section className="catalog-submit-card">
        <div>
          <span className="landing-kicker">{t.submitTitle}</span>
          <p>{t.submitText}</p>
        </div>
        <div className="plot-actions">
          <Link className="btn btn-primary" href={submitLandHref}>
            {sessionStatus === "authenticated" ? t.submitLand : t.loginSubmitLand}
          </Link>
          <Link className="btn btn-ghost" href="/alatau-city#alatau-map">
            {t.openMap}
          </Link>
        </div>
      </section>

      <section className="card">
        <div className="form-grid">
          <div className="form-field">
            <label>{t.purpose}</label>
            <select
              value={filters.purpose}
              onChange={(event) => setFilters((prev) => ({ ...prev, purpose: event.target.value }))}
            >
              <option value="all">{t.anyPurpose}</option>
              {purposes.map((purpose) => (
                <option value={purpose} key={purpose}>
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
                <option value={preset.key} key={preset.key}>
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
            <label>{t.risk}</label>
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

          <div className="form-field">
            <label>{t.sort}</label>
            <select
              value={filters.sort}
              onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
            >
              <option value="roi_desc">{t.roiDesc}</option>
              <option value="price_asc">{t.priceAsc}</option>
              <option value="price_desc">{t.priceDesc}</option>
              <option value="risk_asc">{t.riskAsc}</option>
            </select>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid grid-3">
          {plots.length ? (
            plots.map((plot) => <PlotCard key={plot.id} plot={plot} />)
          ) : (
            <div className="empty-state">{t.noPlots}</div>
          )}
        </div>
      </section>

      {compareIds.length ? (
        <div className="compare-bar">
          <div>
            <strong>{t.selected}</strong> {compareIds.join(", ")}
          </div>
          <div className="plot-actions">
            <button className="btn btn-ghost" type="button" onClick={clearCompare}>
              {t.clear}
            </button>
            <button className="btn btn-accent" type="button" onClick={() => setShowCompare(true)}>
              {t.openCompare}
            </button>
          </div>
        </div>
      ) : null}

      {showCompare ? (
        <section className="section card">
          <div className="section-title">
            <h2>{t.comparePlots}</h2>
            <button className="btn btn-ghost" onClick={() => setShowCompare(false)} type="button">
              {t.close}
            </button>
          </div>
          <div className="grid grid-3">
            {compareRows.map((plot) => (
              <PlotCard mode="compact" key={plot.id} plot={plot} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
