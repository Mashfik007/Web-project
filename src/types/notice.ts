export type LibraryNotice = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

export type AdminNotice = LibraryNotice & {
  recipients: number;
  recipientName?: string | null;
};

export type NotificationRecipient = {
  id: string;
  name: string;
  email: string;
};
