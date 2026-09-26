import connectDB from "@/dbConfig/dbConfig";
import { CommunityGroup } from "@/Model/CommunityGroups";
import { GroupMember } from "@/Model/GroupMembers";

export type CommunityGroupCard = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  joined: boolean;
};

export async function getCommunityGroupCards(userId: string): Promise<CommunityGroupCard[]> {
  await connectDB();
  const groups = await CommunityGroup.find()
    .select("name description")
    .sort({ createdAt: -1 })
    .lean<{ _id: { toString(): string }; name: string; description?: string }[]>();

  if (groups.length === 0) return [];

  const ids = groups.map((group) => group._id.toString());
  const [memberships, counts] = await Promise.all([
    GroupMember.find({ userId, groupId: { $in: ids } })
      .select("groupId")
      .lean<{ groupId: string }[]>(),
    GroupMember.aggregate<{ _id: string; count: number }>([
      { $match: { groupId: { $in: ids } } },
      { $group: { _id: "$groupId", count: { $sum: 1 } } },
    ]),
  ]);

  const joined = new Set(memberships.map((row) => row.groupId));
  const totals = new Map(counts.map((row) => [row._id, row.count]));

  return groups.map((group) => {
    const id = group._id.toString();
    return {
      id,
      name: group.name?.trim() || "Community",
      description: group.description?.trim() || "",
      memberCount: totals.get(id) ?? 0,
      joined: joined.has(id),
    };
  });
}
