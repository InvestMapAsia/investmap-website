"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

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
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const envOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
    setOrigin(envOrigin || window.location.origin);
  }, []);

  const listingUrl = useMemo(() => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return origin ? `${origin}${normalizedPath}` : normalizedPath;
  }, [origin, path]);

  return (
    <div className="qr-panel">
      <div className="qr-body">
        <div className="qr-canvas">
          <QRCodeCanvas
            value={listingUrl}
            title={`${kind}: ${title}`}
            size={150}
            bgColor="#ffffff"
            fgColor="#0F2238"
            level="M"
            includeMargin
          />
        </div>
      </div>
    </div>
  );
}
