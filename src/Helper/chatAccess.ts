import { COMMUNITY_CHAT_ID, communityGroupId, peerFromDirectChat } from "@/Helper/chat";
import { CommunityGroup } from "@/Model/CommunityGroups";
import { GroupMember } from "@/Model/GroupMembers";
import { User } from "@/Model/Users";
import mongoose from "mongoose";

export async function userCanAccessConversation(userId: string, conversationId: string) {
  if (conversationId === COMMUNITY_CHAT_ID) return true;

  const groupId = communityGroupId(conversationId);
  if (groupId) {
    if (!mongoose.Types.ObjectId.isValid(groupId)) return false;
    const group = await CommunityGroup.findById(groupId).select("_id").lean();
    if (!group) return false;
    const member = await GroupMember.findOne({ groupId, userId }).select("_id").lean();
    return Boolean(member);
  }

  const peerId = peerFromDirectChat(conversationId, userId);
  if (!peerId || !mongoose.Types.ObjectId.isValid(peerId)) return false;
  const peer = await User.findById(peerId).select("isAdmin").lean<{ isAdmin?: boolean } | null>();
  return Boolean(peer && !peer.isAdmin);
}
