export type LibraryNotice = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

export type AdminNotice = LibraryNotice & {
  recipients: number;
};
