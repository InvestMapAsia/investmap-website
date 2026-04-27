"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { emitClientEvent, COMPARE_CHANGE_EVENT, FAVORITES_CHANGE_EVENT } from "@/lib/client-events";
import { translatePlotTag } from "@/lib/i18n-content";
import { getPlotCoverUrl } from "@/lib/plot-media";
import { currency } from "@/lib/ui";
import { Plot } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

type Mode = "catalog" | "compact";

const FAVORITES_KEY = "aci_favorites";
const COMPARE_KEY = "aci_compare";

export function PlotCard({ plot, mode = "catalog" }: { plot: Plot; mode?: Mode }) {
  const { lang } = useCurrentLanguage();
  const { status } = useSession();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  const t = pickLang(lang, {
    EN: {
      area: "Area",
      risk: "Risk",
      legal: "Legal",
      details: "Details",
      inFav: "In favorites",
      favorite: "Favorite",
      removeCompare: "Remove compare",
      compare: "Compare",
      invest: "Invest",
      share: "Share",
      shareSuccess: "Plot link copied.",
      shareFail: "Could not share plot link.",
      removeFavError: "Failed to remove favorite.",
      saveFavError: "Failed to save favorite.",
      compareLimit: "You can compare up to 4 plots.",
      legalAPlus: "A+ Full verification",
      legalA: "A Verified",
      legalB: "B Partial",
      legalC: "C Owner declared",
    },
    RU: {
      area: "Площадь",
      risk: "Риск",
      legal: "Юр. статус",
      details: "Детали",
      inFav: "В избранном",
      favorite: "В избранное",
      removeCompare: "Убрать из сравнения",
      compare: "Сравнить",
      invest: "Инвестировать",
      share: "Поделиться",
      shareSuccess: "Ссылка на участок скопирована.",
      shareFail: "Не удалось поделиться ссылкой на участок.",
      removeFavError: "Не удалось удалить из избранного.",
      saveFavError: "Не удалось добавить в избранное.",
      compareLimit: "Можно сравнить не более 4 участков.",
      legalAPlus: "A+ Полная проверка",
      legalA: "A Проверен",
      legalB: "B Частично",
      legalC: "C По данным владельца",
    },
    KZ: {
      area: "Аумағы",
      risk: "Тәуекел",
      legal: "Заң статусы",
      details: "Толығырақ",
      inFav: "Таңдаулыда",
      favorite: "Таңдаулыға",
      removeCompare: "Салыстырудан алып тастау",
      compare: "Салыстыру",
      invest: "Инвестициялау",
      share: "Бөлісу",
      shareSuccess: "Учаске сілтемесі көшірілді.",
      shareFail: "Учаске сілтемесімен бөлісу мүмкін болмады.",
      removeFavError: "Таңдаулыдан өшіру сәтсіз.",
      saveFavError: "Таңдаулыға қосу сәтсіз.",
      compareLimit: "Ең көбі 4 учаскені салыстыруға болады.",
      legalAPlus: "A+ Толық тексерілген",
      legalA: "A Тексерілген",
      legalB: "B Жартылай",
      legalC: "C Иесінің мәліметі",
    },
  });

  const legalLabel = {
    a_plus: t.legalAPlus,
    a: t.legalA,
    b: t.legalB,
    c: t.legalC,
  };

  useEffect(() => {
    const cmp = JSON.parse(localStorage.getItem(COMPARE_KEY) ?? "[]") as string[];
    setCompare(cmp);

    const loadFavorites = async () => {
      if (status === "authenticated") {
        const response = await fetch("/api/favorites", { cache: "no-store" });
        if (response.ok) {
          const payload = (await response.json()) as { data: string[] };
          setFavorites(payload.data);
          return;
        }
      }

      const fav = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]") as string[];
      setFavorites(fav);
    };

    void loadFavorites();
  }, [status]);

  const isFav = useMemo(() => favorites.includes(plot.id), [favorites, plot.id]);
  const inCompare = useMemo(() => compare.includes(plot.id), [compare, plot.id]);
  const coverUrl = useMemo(() => getPlotCoverUrl(plot), [plot]);

  const toggleFavorite = async () => {
    if (status === "authenticated") {
      if (isFav) {
        const response = await fetch(`/api/favorites/${plot.id}`, { method: "DELETE" });
        if (!response.ok) {
          window.alert(t.removeFavError);
          return;
        }
        setFavorites((prev) => prev.filter((id) => id !== plot.id));
        emitClientEvent(FAVORITES_CHANGE_EVENT);
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plotId: plot.id }),
        });
        if (!response.ok) {
          window.alert(t.saveFavError);
          return;
        }
        setFavorites((prev) => Array.from(new Set([...prev, plot.id])));
        emitClientEvent(FAVORITES_CHANGE_EVENT);
      }
      return;
    }

    const next = isFav ? favorites.filter((id) => id !== plot.id) : [...favorites, plot.id];
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(new Set(next))));
    emitClientEvent(FAVORITES_CHANGE_EVENT);
  };

  const toggleCompare = () => {
    if (!inCompare && compare.length >= 4) {
      window.alert(t.compareLimit);
      return;
    }

    const next = inCompare ? compare.filter((id) => id !== plot.id) : [...compare, plot.id];
    setCompare(next);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(Array.from(new Set(next))));
    emitClientEvent(COMPARE_CHANGE_EVENT);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/plots/${plot.id}`;
    const shareData = {
      title: plot.title,
      text: `${plot.id} · ${plot.district}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      window.alert(t.shareSuccess);
    } catch {
      window.alert(t.shareFail);
    }
  };

  return (
    <article className="card plot-card">
      <Link className="plot-card-cover" href={`/plots/${plot.id}`} aria-label={plot.title}>
        <img src={coverUrl} alt={plot.title} loading="lazy" />
      </Link>

      <div className="plot-top">
        <div>
          <div className="plot-id">
            {plot.id} · {plot.district}
          </div>
          <h3 className="card-title">{plot.title}</h3>
          <StatusBadge status={plot.status} />
        </div>
        <div className="plot-price">{currency(plot.price, plot.currency)}</div>
      </div>

      <div className="metric-line">
        <span className="muted">{t.area}</span>
        <strong>{plot.area} ha</strong>
      </div>
      <div className="metric-line">
        <span className="muted">ROI</span>
        <strong>{plot.roi}%</strong>
      </div>
      <div className="metric-line">
        <span className="muted">{t.risk}</span>
        <strong>{plot.riskScore}/100</strong>
      </div>
      <div className="metric-line">
        <span className="muted">{t.legal}</span>
        <strong>{legalLabel[plot.legalGrade]}</strong>
      </div>

      <div className="plot-tags">
        {plot.tags.slice(0, 3).map((tag) => (
          <span className="badge" key={tag}>
            {translatePlotTag(lang, tag)}
          </span>
        ))}
      </div>

      {mode === "catalog" ? (
        <div className="plot-actions">
          <Link href={`/plots/${plot.id}`} className="btn btn-primary">
            {t.details}
          </Link>
          <button onClick={() => void toggleFavorite()} className="btn btn-ghost" type="button">
            {isFav ? t.inFav : t.favorite}
          </button>
          <button onClick={toggleCompare} className="btn btn-ghost" type="button">
            {inCompare ? t.removeCompare : t.compare}
          </button>
          <button onClick={() => void handleShare()} className="btn btn-ghost" type="button">
            {t.share}
          </button>
          <Link href={`/invest?plot=${plot.id}`} className="btn btn-accent">
            {t.invest}
          </Link>
        </div>
      ) : null}
    </article>
  );
}
