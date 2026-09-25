import connectDB from "@/dbConfig/dbConfig";
import { COMMUNITY_CHAT_ID, directChatId } from "@/Helper/chat";
import { FriendRequest } from "@/Model/FriendRequests";
import { Message } from "@/Model/Messages";
import { User } from "@/Model/Users";
import type { ChatInbox, ChatPreview } from "@/types/chat";

const colors = [
  "bg-sky-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function initials(name: string) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "R";
}

function colorFor(name: string) {
  const code = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return colors[code % colors.length];
}

type Account = { _id: { toString(): string }; name: string };

export async function getChatInbox(userId: string): Promise<ChatInbox> {
  await connectDB();

  const [viewer, accounts, friendRows] = await Promise.all([
    User.findById(userId).select("name").lean<{ name?: string } | null>(),
    User.find({ isAdmin: { $ne: true }, _id: { $ne: userId } })
      .select("name")
      .sort({ name: 1 })
      .lean<Account[]>(),
    FriendRequest.find({
      status: "accepted",
      $or: [{ fromId: userId }, { toId: userId }],
    }).lean<{ fromId: string; toId: string }[]>(),
  ]);

  const friendIds = new Set(
    friendRows.map((row) => (row.fromId === userId ? row.toId : row.fromId)),
  );

  const directs: ChatPreview[] = accounts.map((account) => {
    const id = account._id.toString();
    const name = account.name?.trim() || "Reader";
    return {
      conversationId: directChatId(userId, id),
      kind: "direct",
      title: name,
      subtitle: friendIds.has(id) ? "Friend" : "Member",
      initials: initials(name),
      avatarColor: colorFor(name),
      peerId: id,
      isFriend: friendIds.has(id),
      lastBody: "",
      lastAt: null,
    };
  });

  const community: ChatPreview = {
    conversationId: COMMUNITY_CHAT_ID,
    kind: "group",
    title: "Readers Community",
    subtitle: `${accounts.length + 1} members`,
    initials: "RC",
    avatarColor: "bg-sky-600",
    isFriend: false,
    lastBody: "",
    lastAt: null,
  };

  const conversationIds = [
    COMMUNITY_CHAT_ID,
    ...directs.map((item) => item.conversationId),
  ];
  const previews = await Message.aggregate<{
    _id: string;
    body: string;
    createdAt: Date;
  }>([
    { $match: { conversationId: { $in: conversationIds } } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$conversationId",
        body: { $first: "$body" },
        createdAt: { $first: "$createdAt" },
      },
    },
  ]);
  const latest = new Map(previews.map((row) => [row._id, row]));

  function applyPreview(item: ChatPreview): ChatPreview {
    const row = latest.get(item.conversationId);
    if (!row) return item;
    return {
      ...item,
      lastBody: row.body,
      lastAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    };
  }

  const withPreview = directs.map(applyPreview).sort((a, b) => {
    if (a.isFriend !== b.isFriend) return a.isFriend ? -1 : 1;
    const aTime = a.lastAt ? new Date(a.lastAt).getTime() : 0;
    const bTime = b.lastAt ? new Date(b.lastAt).getTime() : 0;
    if (aTime !== bTime) return bTime - aTime;
    return a.title.localeCompare(b.title);
  });

  return {
    viewerId: userId,
    viewerName: viewer?.name?.trim() || "Reader",
    community: applyPreview(community),
    directs: withPreview,
  };
}
