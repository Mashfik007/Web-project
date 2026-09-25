export type ChatKind = "group" | "direct";

export type ChatPreview = {
  conversationId: string;
  kind: ChatKind;
  title: string;
  subtitle: string;
  initials: string;
  avatarColor: string;
  peerId?: string;
  isFriend: boolean;
  lastBody: string;
  lastAt: string | null;
};

export type ChatInbox = {
  viewerId: string;
  viewerName: string;
  community: ChatPreview;
  directs: ChatPreview[];
};

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  initials: string;
  avatarColor: string;
  body: string;
  createdAt: string;
};

export type LiveChatMessage = ChatMessage & {
  conversationId: string;
};
