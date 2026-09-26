import connectDB from "@/dbConfig/dbConfig";
import { unreadByConversation } from "@/data/getUnreadChatCount";
import { COMMUNITY_CHAT_ID, directChatId, groupChatId } from "@/Helper/chat";
import { CommunityGroup } from "@/Model/CommunityGroups";
import { FriendRequest } from "@/Model/FriendRequests";
import { GroupMember } from "@/Model/GroupMembers";
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

  const [viewer, accounts, friendRows, createdGroups, memberships] = await Promise.all([
    User.findById(userId).select("name").lean<{ name?: string } | null>(),
    User.find({ isAdmin: { $ne: true }, _id: { $ne: userId } })
      .select("name")
      .sort({ name: 1 })
      .lean<Account[]>(),
    FriendRequest.find({
      status: "accepted",
      $or: [{ fromId: userId }, { toId: userId }],
    }).lean<{ fromId: string; toId: string }[]>(),
    CommunityGroup.find()
      .select("name description")
      .sort({ createdAt: 1 })
      .lean<{ _id: { toString(): string }; name: string; description?: string }[]>(),
    GroupMember.find({ userId }).select("groupId").lean<{ groupId: string }[]>(),
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
      unread: 0,
    };
  });

  const memberCount = accounts.length + 1;
  const joinedIds = new Set(memberships.map((row) => row.groupId));
  const joinedGroups = createdGroups.filter((group) => joinedIds.has(group._id.toString()));
  const joinedGroupIds = joinedGroups.map((group) => group._id.toString());
  const memberTotals = new Map<string, number>();
  if (joinedGroupIds.length > 0) {
    const rows = await GroupMember.aggregate<{ _id: string; count: number }>([
      { $match: { groupId: { $in: joinedGroupIds } } },
      { $group: { _id: "$groupId", count: { $sum: 1 } } },
    ]);
    for (const row of rows) memberTotals.set(row._id, row.count);
  }

  const groups: ChatPreview[] = [
    {
      conversationId: COMMUNITY_CHAT_ID,
      kind: "group",
      title: "Readers Community",
      subtitle: `${memberCount} members`,
      initials: "RC",
      avatarColor: "bg-sky-600",
      isFriend: false,
      lastBody: "",
      lastAt: null,
      unread: 0,
    },
    ...joinedGroups.map((group) => {
      const name = group.name?.trim() || "Community";
      const id = group._id.toString();
      const total = memberTotals.get(id) ?? 1;
      return {
        conversationId: groupChatId(id),
        kind: "group" as const,
        title: name,
        subtitle: `${total} ${total === 1 ? "member" : "members"}`,
        initials: initials(name),
        avatarColor: colorFor(name),
        isFriend: false,
        lastBody: "",
        lastAt: null,
        unread: 0,
        description: group.description?.trim() || "",
      };
    }),
  ];

  const conversationIds = [
    ...groups.map((item) => item.conversationId),
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
  const unread = await unreadByConversation(userId, conversationIds);

  function applyPreview(item: ChatPreview): ChatPreview {
    const row = latest.get(item.conversationId);
    return {
      ...item,
      lastBody: row?.body || item.lastBody,
      lastAt: row?.createdAt ? new Date(row.createdAt).toISOString() : item.lastAt,
      unread: unread.get(item.conversationId) ?? 0,
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
    groups: groups.map(applyPreview),
    directs: withPreview,
  };
}
