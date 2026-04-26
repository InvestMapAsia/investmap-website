"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { pickLang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";

type ListingKind = "plot" | "project";

export function ListingQrCode({
  title,
  path,
  kind,
}: {
  title: string;
  path: string;
  kind: ListingKind;
}) {
  const { lang } = useCurrentLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [origin, setOrigin] = useState("");

  const t = pickLang(lang, {
    EN: {
      title: "QR code",
      plotHint: "Scan to open this land listing.",
      projectHint: "Scan to open this project page.",
      download: "Download PNG",
      copy: "Copy link",
      copied: "Link copied.",
      copyFail: "Could not copy link.",
    },
    RU: {
      title: "QR-код",
      plotHint: "Отсканируйте, чтобы открыть страницу земли.",
      projectHint: "Отсканируйте, чтобы открыть страницу проекта.",
      download: "Скачать PNG",
      copy: "Скопировать ссылку",
      copied: "Ссылка скопирована.",
      copyFail: "Не удалось скопировать ссылку.",
    },
    KZ: {
      title: "QR-код",
      plotHint: "Жер парағын ашу үшін сканерлеңіз.",
      projectHint: "Жоба парағын ашу үшін сканерлеңіз.",
      download: "PNG жүктеу",
      copy: "Сілтемені көшіру",
      copied: "Сілтеме көшірілді.",
      copyFail: "Сілтемені көшіру мүмкін болмады.",
    },
  });

  useEffect(() => {
    const envOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
    setOrigin(envOrigin || window.location.origin);
  }, []);

  const listingUrl = useMemo(() => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return origin ? `${origin}${normalizedPath}` : normalizedPath;
  }, [origin, path]);

  const fileName = `${kind}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${fileName || kind}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl);
      window.alert(t.copied);
    } catch {
      window.alert(t.copyFail);
    }
  };

  return (
    <div className="qr-panel">
      <div className="qr-copy">
        <h3 className="card-title">{t.title}</h3>
        <p className="muted">{kind === "plot" ? t.plotHint : t.projectHint}</p>
      </div>
      <div className="qr-body">
        <div className="qr-canvas">
          <QRCodeCanvas
            ref={canvasRef}
            value={listingUrl}
            title={`${kind}: ${title}`}
            size={150}
            bgColor="#ffffff"
            fgColor="#0F2238"
            level="M"
            includeMargin
          />
        </div>
        <div className="qr-actions">
          <button className="btn btn-primary" type="button" onClick={handleDownload}>
            {t.download}
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => void handleCopy()}>
            {t.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
