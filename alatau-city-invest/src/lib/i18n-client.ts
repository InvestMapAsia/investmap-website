"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_LANG,
  LANG_CHANGE_EVENT,
  LANG_STORAGE_KEY,
  Lang,
  normalizeLang,
} from "@/lib/i18n";

export function applyDocumentLanguage(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-lang", lang);
  document.documentElement.lang = lang === "RU" ? "ru" : lang === "KZ" ? "kk" : "en";
}

export function readStoredLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANG;
  return normalizeLang(window.localStorage.getItem(LANG_STORAGE_KEY));
}

export function writeStoredLanguage(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  applyDocumentLanguage(lang);
  window.dispatchEvent(new CustomEvent<Lang>(LANG_CHANGE_EVENT, { detail: lang }));
}

export function useCurrentLanguage() {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const initial = readStoredLanguage();
    setLang(initial);
    applyDocumentLanguage(initial);

    const onStorage = (event: StorageEvent) => {
      if (event.key === LANG_STORAGE_KEY) {
        const next = normalizeLang(event.newValue);
        setLang(next);
        applyDocumentLanguage(next);
      }
    };

    const onLangChange = (event: Event) => {
      const custom = event as CustomEvent<Lang>;
      const next = normalizeLang(custom.detail);
      setLang(next);
      applyDocumentLanguage(next);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(LANG_CHANGE_EVENT, onLangChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(LANG_CHANGE_EVENT, onLangChange);
    };
  }, []);

  const setLanguage = useCallback((next: Lang) => {
    setLang(next);
    writeStoredLanguage(next);
  }, []);

  return { lang, setLanguage };
}
