"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { pickLang } from "@/lib/i18n";
import { localeByLang } from "@/lib/i18n-content";
import { NotificationItem } from "@/lib/types";

type NotificationPayload = {
  data: NotificationItem[];
  unreadCount: number;
};

export function NotificationsBell() {
  const { lang } = useCurrentLanguage();
  const locale = localeByLang(lang);
  const { status } = useSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const t = pickLang(lang, {
    EN: {
      title: "Notifications",
      markRead: "Mark read",
      noItems: "No notifications yet.",
      markAll: "Mark all read",
    },
    RU: {
      title: "Уведомления",
      markRead: "Прочитано",
      noItems: "Пока нет уведомлений.",
      markAll: "Прочитать все",
    },
    KZ: {
      title: "Хабарламалар",
      markRead: "Оқылды",
      noItems: "Әзірге хабарлама жоқ.",
      markAll: "Барлығын оқу",
    },
    CN: {
      title: "通知",
      markRead: "标记已读",
      noItems: "暂无通知。",
      markAll: "全部标记已读",
    },
  });

  const unread = useMemo(() => items.filter((item) => !item.readAt), [items]);

  useEffect(() => {
    if (status !== "authenticated") {
      setItems([]);
      setUnreadCount(0);
      return;
    }

    const load = async () => {
      const response = await fetch("/api/notifications", { cache: "no-store" });
      if (!response.ok) return;
      const payload = (await response.json()) as NotificationPayload;
      setItems(payload.data);
      setUnreadCount(payload.unreadCount);
    };

    void load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void load();
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [status]);

  const markAsRead = async (id: string) => {
    const response = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    if (!response.ok) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, readAt: item.readAt ?? new Date().toISOString() } : item
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <button className="btn btn-ghost" type="button" onClick={() => setOpen((prev) => !prev)}>
        {t.title} {unreadCount ? `(${unreadCount})` : ""}
      </button>

      {open ? (
        <div
          className="card"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 360,
            maxHeight: 420,
            overflow: "auto",
            zIndex: 110,
          }}
        >
          <h4 className="card-title">{t.title}</h4>

          {items.length ? (
            <div className="grid" style={{ gap: 10 }}>
              {items.map((item) => (
                <article
                  key={item.id}
                  className="card"
                  style={{
                    padding: 10,
                    border: !item.readAt ? "1px solid #0f5a73" : "1px solid var(--border)",
                  }}
                >
                  <strong style={{ fontSize: "0.9rem" }}>{item.title}</strong>
                  <p className="muted" style={{ marginTop: 4, fontSize: "0.82rem" }}>
                    {item.message}
                  </p>
                  <div className="plot-actions" style={{ marginTop: 8 }}>
                    <span className="muted" style={{ fontSize: "0.76rem" }}>
                      {new Date(item.createdAt).toLocaleString(locale)}
                    </span>
                    {!item.readAt ? (
                      <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => void markAsRead(item.id)}
                      >
                        {t.markRead}
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">{t.noItems}</div>
          )}

          {unread.length ? (
            <div className="plot-actions" style={{ marginTop: 10 }}>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  unread.forEach((item) => {
                    void markAsRead(item.id);
                  });
                }}
              >
                {t.markAll}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
