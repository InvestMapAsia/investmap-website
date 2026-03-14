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
      "/projects": "Projects",
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
    brandSubtitle: "РџР»Р°С‚С„РѕСЂРјР° Р·РµРјРµР»СЊРЅС‹С… РёРЅРІРµСЃС‚РёС†РёР№",
    nav: {
      "/": "Р“Р»Р°РІРЅР°СЏ",
      "/map": "РљР°СЂС‚Р°",
      "/catalog": "РљР°С‚Р°Р»РѕРі",
      "/pricing": "РўР°СЂРёС„С‹",
      "/news": "РќРѕРІРѕСЃС‚Рё",
      "/faq": "FAQ",
      "/contacts": "РљРѕРЅС‚Р°РєС‚С‹",
      "/admin": "РђРґРјРёРЅ",
    },
    investor: "РРЅРІРµСЃС‚РѕСЂ",
    owner: "Р’Р»Р°РґРµР»РµС†",
    admin: "РђРґРјРёРЅ",
    signOut: "Р’С‹Р№С‚Рё",
    login: "Р’РѕР№С‚Рё",
    footerDescription: "РџСЂРµРјРёР°Р»СЊРЅР°СЏ С†РёС„СЂРѕРІР°СЏ РїР»Р°С‚С„РѕСЂРјР° РёРЅРІРµСЃС‚РёС†РёР№ РІ Р·РµРјРµР»СЊРЅС‹Рµ СѓС‡Р°СЃС‚РєРё Alatau City.",
    legal: "РџСЂР°РІРѕРІС‹Рµ",
    faq: "FAQ",
    support: "РџРѕРґРґРµСЂР¶РєР°",
  },
  KZ: {
    brandSubtitle: "Р–РµСЂ РёРЅРІРµСЃС‚РёС†РёСЏ РїР»Р°С‚С„РѕСЂРјР°СЃС‹",
    nav: {
      "/": "Р‘Р°СЃС‚С‹ Р±РµС‚",
      "/map": "РљР°СЂС‚Р°",
      "/catalog": "РљР°С‚Р°Р»РѕРі",
      "/pricing": "РўР°СЂРёС„С‚РµСЂ",
      "/news": "Р–Р°ТЈР°Р»С‹Т›С‚Р°СЂ",
      "/faq": "FAQ",
      "/contacts": "Р‘Р°Р№Р»Р°РЅС‹СЃ",
      "/admin": "УРєС–РјС€С–",
    },
    investor: "РРЅРІРµСЃС‚РѕСЂ",
    owner: "Р–РµСЂ РёРµСЃС–",
    admin: "УРєС–РјС€С–",
    signOut: "РЁС‹Т“Сѓ",
    login: "РљС–СЂСѓ",
    footerDescription: "Alatau City Р¶РµСЂ СѓС‡Р°СЃРєРµР»РµСЂС–РЅРµ РёРЅРІРµСЃС‚РёС†РёСЏР»Р°СѓТ“Р° Р°СЂРЅР°Р»Т“Р°РЅ РїСЂРµРјРёСѓРј С†РёС„СЂР»С‹Т› РїР»Р°С‚С„РѕСЂРјР°.",
    legal: "Р—Р°ТЈ",
    faq: "FAQ",
    support: "ТљРѕР»РґР°Сѓ",
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
                <Link href="/cabinet/projects" className="btn btn-ghost">
                  {lang === "RU" ? "РџСЂРѕРµРєС‚С‹" : lang === "KZ" ? "Р–РѕР±Р°Р»Р°СЂ" : "Projects"}
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

