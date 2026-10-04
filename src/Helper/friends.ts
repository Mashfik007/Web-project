import { FriendRequest } from "@/Model/FriendRequests";

export async function acceptedFriendIds(userId: string): Promise<string[]> {
  const rows = await FriendRequest.find({
    status: "accepted",
    $or: [{ fromId: userId }, { toId: userId }],
  }).lean<{ fromId: string; toId: string }[]>();

  return rows.map((row) => (row.fromId === userId ? row.toId : row.fromId));
}

export async function areFriends(userId: string, peerId: string) {
  const row = await FriendRequest.findOne({
    status: "accepted",
    $or: [
      { fromId: userId, toId: peerId },
      { fromId: peerId, toId: userId },
    ],
  })
    .select("_id")
    .lean();

  return Boolean(row);
}
