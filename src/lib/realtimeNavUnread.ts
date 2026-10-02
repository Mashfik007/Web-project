const EVENT_PREFIX = "folio:nav-unread:";

const viewing = new Set<string>();

function storageKey(key: string) {
  return `folio:nav-unread:${key}`;
}

export function navUnreadEventName(key: string) {
  return `${EVENT_PREFIX}${key}`;
}

export function setViewingNavUnread(key: string, next: boolean) {
  if (next) {
    viewing.add(key);
    publishNavUnread(key, 0);
  } else {
    viewing.delete(key);
  }
}

export function isViewingNavUnread(key: string) {
  return viewing.has(key);
}

export function readNavUnread(key: string) {
  if (typeof window === "undefined") return 0;
  const raw = window.sessionStorage.getItem(storageKey(key));
  const count = Number(raw);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

export function publishNavUnread(key: string, count: number) {
  const next = Math.max(0, Math.floor(count));
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(storageKey(key), String(next));
  }
  window.dispatchEvent(
    new CustomEvent(navUnreadEventName(key), { detail: next }),
  );
}

export function bumpNavUnread(key: string) {
  if (viewing.has(key)) return;
  publishNavUnread(key, readNavUnread(key) + 1);
}
