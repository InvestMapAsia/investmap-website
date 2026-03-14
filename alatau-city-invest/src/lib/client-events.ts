export const COMPARE_CHANGE_EVENT = "aci:compare-change";
export const FAVORITES_CHANGE_EVENT = "aci:favorites-change";

export function emitClientEvent(eventName: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(eventName));
}
