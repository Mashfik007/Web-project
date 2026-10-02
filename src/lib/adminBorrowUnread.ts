export const ADMIN_BORROW_UNREAD_EVENT = "folio:admin-borrow-unread";

const STORAGE_KEY = "folio:admin-borrow-unread";

let viewing = false;

export function setViewingAdminBorrowRequests(next: boolean) {
  viewing = next;
  if (next) {
    publishAdminBorrowUnread(0);
  }
}

export function isViewingAdminBorrowRequests() {
  return viewing;
}

export function readAdminBorrowUnread() {
  if (typeof window === "undefined") return 0;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  const count = Number(raw);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

export function publishAdminBorrowUnread(count: number) {
  const next = Math.max(0, Math.floor(count));
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, String(next));
  }
  window.dispatchEvent(
    new CustomEvent(ADMIN_BORROW_UNREAD_EVENT, { detail: next }),
  );
}

export function bumpAdminBorrowUnread() {
  if (viewing) return;
  publishAdminBorrowUnread(readAdminBorrowUnread() + 1);
}
