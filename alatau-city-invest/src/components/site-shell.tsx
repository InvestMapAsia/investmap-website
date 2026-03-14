"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { useCurrentLanguage } from "@/lib/i18n-client";
import { Lang } from "@/lib/i18n";
import { navLinks } from "@/lib/ui";
import { NotificationsBell } from "@/components/notifications-bell";

const uiText: Record<
  Lang,
  {
    brandSubtitle: string;
    nav: Record<string, string>;
    investor: string;
    owner: string;
    admin: string;
    signOut: string;
    login: string;
    footerDescription: string;
    legal: string;
    faq: string;
    support: string;
  }
> = {
  EN: {
    brandSubtitle: "Land Intelligence Platform",
    nav: {
      "/": "Home",
      "/map": "Map",
      "/catalog": "Catalog",
      "/pricing": "Pricing",
      "/news": "News",
      "/faq": "FAQ",
      "/contacts": "Contacts",
      "/admin": "Admin",
    },
    investor: "Investor",
    owner: "Owner",
    admin: "Admin",
    signOut: "Sign out",
    login: "Login",
    footerDescription: "Premium digital platform for land investment in Alatau City.",
    legal: "Legal",
    faq: "FAQ",
    support: "Support",
  },
  RU: {
    brandSubtitle: "Платформа земельных инвестиций",
    nav: {
      "/": "Главная",
      "/map": "Карта",
      "/catalog": "Каталог",
      "/pricing": "Тарифы",
      "/news": "Новости",
      "/faq": "FAQ",
      "/contacts": "Контакты",
      "/admin": "Админ",
    },
    investor: "Инвестор",
    owner: "Владелец",
    admin: "Админ",
    signOut: "Выйти",
    login: "Войти",
    footerDescription: "Премиальная цифровая платформа инвестиций в земельные участки Alatau City.",
    legal: "Правовые",
    faq: "FAQ",
    support: "Поддержка",
  },
  KZ: {
    brandSubtitle: "Жер инвестиция платформасы",
    nav: {
      "/": "Басты бет",
      "/map": "Карта",
      "/catalog": "Каталог",
      "/pricing": "Тарифтер",
      "/news": "Жаңалықтар",
      "/faq": "FAQ",
      "/contacts": "Байланыс",
      "/admin": "Әкімші",
    },
    investor: "Инвестор",
    owner: "Жер иесі",
    admin: "Әкімші",
    signOut: "Шығу",
    login: "Кіру",
    footerDescription: "Alatau City жер учаскелеріне инвестициялауға арналған премиум цифрлық платформа.",
    legal: "Заң",
    faq: "FAQ",
    support: "Қолдау",
  },
};

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  return (
    <div className="lang-switch">
      {(["EN", "RU", "KZ"] as Lang[]).map((item) => (
        <button
          key={item}
          className={item === lang ? "lang-btn active" : "lang-btn"}
          onClick={() => onChange(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { lang, setLanguage } = useCurrentLanguage();

  const t = useMemo(() => uiText[lang], [lang]);
  const role = session?.user?.role;

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/">
            <span className="brand-logo">
              <Image
                src="/alatau-logo.png"
                alt="Alatau City Invest logo"
                fill
                sizes="56px"
                style={{ objectFit: "contain" }}
                priority
              />
            </span>
            <span className="brand-text">
              <span className="brand-title">Alatau City Invest</span>
              <span className="brand-subtitle">{t.brandSubtitle}</span>
            </span>
          </Link>

          <nav className="main-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className={pathname === link.href ? "active" : ""}
                href={link.href}
              >
                {t.nav[link.href] ?? link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <LangSwitch lang={lang} onChange={setLanguage} />
            <NotificationsBell />

            {status === "authenticated" ? (
              <>
                <span className="badge">{role}</span>
                <Link href="/cabinet/investor" className="btn btn-ghost">
                  {t.investor}
                </Link>
                {(role === "OWNER" || role === "ADMIN") && (
                  <Link href="/cabinet/owner" className="btn btn-ghost">
                    {t.owner}
                  </Link>
                )}
                {(role === "ADMIN" || role === "MODERATOR") && (
                  <Link href="/admin" className="btn btn-ghost">
                    {t.admin}
                  </Link>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => void signOut({ callbackUrl: "/" })}
                >
                  {t.signOut}
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary">
                {t.login}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="page">{children}</main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>Alatau City Invest</strong>
            <p className="muted">{t.footerDescription}</p>
          </div>
          <div className="footer-links">
            <Link href="/legal">{t.legal}</Link>
            <Link href="/faq">{t.faq}</Link>
            <Link href="/contacts">{t.support}</Link>
            <Link href="/admin">{t.admin}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
