export const NOTICE_UNREAD_EVENT = "folio:notice-unread";

let viewing = false;

export function setViewingNotices(next: boolean) {
  viewing = next;
}

export function isViewingNotices() {
  return viewing;
}

export function publishNoticeUnread(count: number) {
  window.dispatchEvent(new CustomEvent(NOTICE_UNREAD_EVENT, { detail: count }));
}

export async function markNoticesRead() {
  const response = await fetch("/api/users/notifications/read", { method: "POST" });
  if (!response.ok) return;
  const payload = (await response.json()) as { data?: { unread?: number } };
  if (typeof payload.data?.unread === "number") {
    publishNoticeUnread(payload.data.unread);
  }
}
