import connectDB from "@/dbConfig/dbConfig";
import { COMMUNITY_CHAT_ID, directChatId, groupChatId } from "@/Helper/chat";
import { acceptedFriendIds } from "@/Helper/friends";
import { ChatRead } from "@/Model/ChatReads";
import { GroupMember } from "@/Model/GroupMembers";
import { Message } from "@/Model/Messages";

export async function conversationIdsFor(userId: string) {
  await connectDB();
  const [memberships, friendIds] = await Promise.all([
    GroupMember.find({ userId }).select("groupId").lean<{ groupId: string }[]>(),
    acceptedFriendIds(userId),
  ]);

  return [
    COMMUNITY_CHAT_ID,
    ...memberships.map((row) => groupChatId(row.groupId)),
    ...friendIds.map((peerId) => directChatId(userId, peerId)),
  ];
}

export async function unreadByConversation(userId: string, conversationIds: string[]) {
  const counts = new Map<string, number>();
  if (conversationIds.length === 0) return counts;

  await connectDB();
  const reads = await ChatRead.find({
    userId,
    conversationId: { $in: conversationIds },
  })
    .select("conversationId lastReadAt")
    .lean<{ conversationId: string; lastReadAt: Date }[]>();
  const readAt = new Map(reads.map((row) => [row.conversationId, row.lastReadAt]));

  const clauses = conversationIds.map((conversationId) => {
    const since = readAt.get(conversationId);
    return since
      ? { conversationId, senderId: { $ne: userId }, createdAt: { $gt: since } }
      : { conversationId, senderId: { $ne: userId } };
  });

  const rows = await Message.aggregate<{ _id: string; count: number }>([
    { $match: { $or: clauses } },
    { $group: { _id: "$conversationId", count: { $sum: 1 } } },
  ]);

  for (const row of rows) counts.set(row._id, row.count);
  return counts;
}

export async function getUnreadChatCount(userId: string) {
  const conversationIds = await conversationIdsFor(userId);
  const counts = await unreadByConversation(userId, conversationIds);
  let total = 0;
  for (const count of counts.values()) total += count;
  return total;
}
