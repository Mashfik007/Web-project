export const COMMUNITY_CHAT_ID = "community";

export function groupChatId(groupId: string) {
  return `group:${groupId}`;
}

export function communityGroupId(conversationId: string) {
  if (!conversationId.startsWith("group:")) return null;
  const id = conversationId.slice("group:".length);
  return /^[a-f\d]{24}$/i.test(id) ? id : null;
}

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
