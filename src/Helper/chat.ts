export const COMMUNITY_CHAT_ID = "community";

export function directChatId(a: string, b: string) {
  const [left, right] = [a, b].sort();
  return `dm:${left}:${right}`;
}

export function peerFromDirectChat(conversationId: string, viewerId: string) {
  if (!conversationId.startsWith("dm:")) return null;
  const [left, right] = conversationId.slice(3).split(":");
  if (!left || !right) return null;
  if (left !== viewerId && right !== viewerId) return null;
  return left === viewerId ? right : left;
}
