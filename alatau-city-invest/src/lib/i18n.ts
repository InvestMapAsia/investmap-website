export type Lang = "EN" | "RU" | "KZ";

export const LANG_STORAGE_KEY = "aci_lang";
export const LANG_CHANGE_EVENT = "aci:lang-change";
export const DEFAULT_LANG: Lang = "EN";
export const SUPPORTED_LANGS: Lang[] = ["EN", "RU", "KZ"];

export function normalizeLang(value?: string | null): Lang {
  if (!value) return DEFAULT_LANG;
  const upper = value.toUpperCase();
  return (SUPPORTED_LANGS.includes(upper as Lang) ? upper : DEFAULT_LANG) as Lang;
}

export type LangMap<T> = Record<Lang, T>;

export function pickLang<T>(lang: Lang, map: LangMap<T>) {
  return map[lang];
}
