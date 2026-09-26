import connectDB from "@/dbConfig/dbConfig";
import { CommunityGroup } from "@/Model/CommunityGroups";

export type AdminCommunityGroup = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export async function getCommunityGroups(): Promise<AdminCommunityGroup[]> {
  await connectDB();
  const groups = await CommunityGroup.find()
    .sort({ createdAt: -1 })
    .lean<{ _id: { toString(): string }; name: string; description?: string; createdAt?: Date }[]>();

  return groups.map((group) => ({
    id: group._id.toString(),
    name: group.name,
    description: group.description?.trim() || "",
    createdAt: group.createdAt ? new Date(group.createdAt).toISOString() : "",
  }));
}
