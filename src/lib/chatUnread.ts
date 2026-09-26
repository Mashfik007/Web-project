export const CHAT_UNREAD_EVENT = "folio:chat-unread";

let viewingId: string | null = null;

export function setViewingConversation(id: string | null) {
  viewingId = id;
}

export function getViewingConversation() {
  return viewingId;
}

export function publishUnreadCount(count: number) {
  window.dispatchEvent(new CustomEvent(CHAT_UNREAD_EVENT, { detail: count }));
}

export async function markConversationRead(conversationId: string) {
  const response = await fetch("/api/users/chat/read", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId }),
  });
  if (!response.ok) return;
  const payload = (await response.json()) as { data?: { unread?: number } };
  if (typeof payload.data?.unread === "number") {
    publishUnreadCount(payload.data.unread);
  }
}
