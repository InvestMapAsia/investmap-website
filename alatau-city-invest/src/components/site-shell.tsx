"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { NotificationsBell } from "@/components/notifications-bell";
import { Lang } from "@/lib/i18n";
import { useCurrentLanguage } from "@/lib/i18n-client";

const uiText: Record<
  Lang,
  {
    brandSubtitle: string;
    nav: Record<string, string>;
    moreMenu: string;
    accountMenu: string;
    investor: string;
    owner: string;
    projects: string;
    admin: string;
    moderator: string;
    signOut: string;
    login: string;
    footerDescription: string;
    faq: string;
    support: string;
  }
> = {
  EN: {
    brandSubtitle: "Investment Platform",
    nav: {
      "/": "Home",
      "/alatau-city": "Alatau City",
      "/catalog": "Catalog",
      "/projects": "Projects",
      "/pricing": "Pricing",
      "/news": "News",
      "/faq": "FAQ",
      "/contacts": "Contacts",
    },
    moreMenu: "More",
    accountMenu: "Account",
    investor: "Investor",
    owner: "Owner",
    projects: "Projects",
    admin: "Admin",
    moderator: "Moderator",
    signOut: "Sign out",
    login: "Login",
    footerDescription:
      "Digital platform for businesses seeking external investment and investors looking for transparent opportunities.",
    faq: "FAQ",
    support: "Support",
  },
  RU: {
    brandSubtitle: "Инвестиционная платформа",
    nav: {
      "/": "Главная",
      "/alatau-city": "Alatau City",
      "/catalog": "Каталог",
      "/projects": "Проекты",
      "/pricing": "Тарифы",
      "/news": "Новости",
      "/faq": "FAQ",
      "/contacts": "Контакты",
    },
    moreMenu: "Еще",
    accountMenu: "Кабинет",
    investor: "Инвестор",
    owner: "Владелец",
    projects: "Проекты",
    admin: "Админ",
    moderator: "Модератор",
    signOut: "Выйти",
    login: "Войти",
    footerDescription:
      "Цифровая платформа для бизнеса, который ищет внешние инвестиции, и инвесторов, которым нужны прозрачные возможности.",
    faq: "FAQ",
    support: "Поддержка",
  },
  KZ: {
    brandSubtitle: "Инвестициялық платформа",
    nav: {
      "/": "Басты бет",
      "/alatau-city": "Alatau City",
      "/catalog": "Каталог",
      "/projects": "Жобалар",
      "/pricing": "Тарифтер",
      "/news": "Жаңалықтар",
      "/faq": "FAQ",
      "/contacts": "Байланыс",
    },
    moreMenu: "Қосымша",
    accountMenu: "Кабинет",
    investor: "Инвестор",
    owner: "Иесі",
    projects: "Жобалар",
    admin: "Әкімші",
    moderator: "Модератор",
    signOut: "Шығу",
    login: "Кіру",
    footerDescription:
      "Сыртқы инвестиция іздеген бизнес пен ашық мүмкіндіктер іздеген инвесторларға арналған цифрлық платформа.",
    faq: "FAQ",
    support: "Қолдау",
  },
  CN: {
    brandSubtitle: "投资平台",
    nav: {
      "/": "首页",
      "/alatau-city": "Alatau City",
      "/catalog": "土地目录",
      "/projects": "项目",
      "/pricing": "价格",
      "/news": "新闻",
      "/faq": "FAQ",
      "/contacts": "联系",
    },
    moreMenu: "更多",
    accountMenu: "账户",
    investor: "投资者",
    owner: "业主",
    projects: "项目",
    admin: "管理",
    moderator: "审核",
    signOut: "退出",
    login: "登录",
    footerDescription:
      "面向寻找外部投资的企业，以及寻找透明机会的投资者的数字平台。",
    faq: "FAQ",
    support: "支持",
  },
};

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  return (
    <div className="lang-switch">
      {(["EN", "RU", "KZ", "CN"] as Lang[]).map((item) => (
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
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryNav = ["/", "/alatau-city", "/catalog", "/projects"] as const;
  const secondaryNav = ["/pricing", "/news", "/faq", "/contacts"] as const;

  const t = useMemo(() => uiText[lang], [lang]);
  const role = session?.user?.role;
  const roleLabel =
    role === "ADMIN"
      ? t.admin
      : role === "MODERATOR"
        ? t.moderator
        : role === "OWNER"
          ? t.owner
          : role === "INVESTOR"
            ? t.investor
            : role;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/" onClick={() => setMoreOpen(false)}>
            <span className="brand-logo">
              <Image
                src="/alatau-logo.png"
                alt="InvestMap logo"
                fill
                sizes="56px"
                style={{ objectFit: "contain" }}
                priority
              />
            </span>
            <span className="brand-text">
              <span className="brand-title">InvestMap</span>
              <span className="brand-subtitle">{t.brandSubtitle}</span>
            </span>
          </Link>

          <nav className="main-nav">
            {primaryNav.map((href) => (
              <Link
                key={href}
                className={isActive(href) ? "active" : ""}
                href={href}
                onClick={() => setMoreOpen(false)}
              >
                {t.nav[href]}
              </Link>
            ))}
            <details
              className="dropdown nav-dropdown"
              open={moreOpen}
              onToggle={(event) => setMoreOpen(event.currentTarget.open)}
            >
              <summary
                className={
                  secondaryNav.some((href) => isActive(href))
                    ? "dropdown-summary active"
                    : "dropdown-summary"
                }
              >
                {t.moreMenu}
              </summary>
              <div className="dropdown-menu">
                {secondaryNav.map((href) => (
                  <Link key={href} href={href} onClick={() => setMoreOpen(false)}>
                    {t.nav[href]}
                  </Link>
                ))}
              </div>
            </details>
          </nav>

          <div className="header-actions" onClick={() => setMoreOpen(false)}>
            <LangSwitch
              lang={lang}
              onChange={(nextLang) => {
                setMoreOpen(false);
                setLanguage(nextLang);
              }}
            />
            <NotificationsBell />

            {status === "authenticated" ? (
              <details className="dropdown account-dropdown">
                <summary className="btn btn-ghost account-summary">{t.accountMenu}</summary>
                <div className="dropdown-menu dropdown-menu-right">
                  <span className="dropdown-role">{roleLabel}</span>

                  {role === "INVESTOR" ? <Link href="/cabinet/investor">{t.investor}</Link> : null}

                  {(role === "INVESTOR" || role === "OWNER") && (
                    <Link href="/cabinet/projects">{t.projects}</Link>
                  )}

                  {role === "OWNER" ? <Link href="/cabinet/owner">{t.owner}</Link> : null}

                  {(role === "ADMIN" || role === "MODERATOR") && <Link href="/admin">{t.admin}</Link>}

                  <button
                    className="dropdown-signout"
                    type="button"
                    onClick={() => void signOut({ callbackUrl: "/" })}
                  >
                    {t.signOut}
                  </button>
                </div>
              </details>
            ) : (
              <Link href="/login" className="btn btn-primary" onClick={() => setMoreOpen(false)}>
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
            <strong>InvestMap</strong>
            <p className="muted">{t.footerDescription}</p>
          </div>
          <div className="footer-links">
            <Link href="/faq">{t.faq}</Link>
            <Link href="/contacts">{t.support}</Link>
            <Link href="/admin">{t.admin}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
