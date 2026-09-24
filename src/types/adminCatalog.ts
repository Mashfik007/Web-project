export type AdminBookStatus = "Available" | "On Loan" | "Reserved";

export type AdminBook = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
  category: string;
  copies: number;
  available: number;
  status: AdminBookStatus;
  coverClass: string;
};

export type AdminCategory = {
  id: number;
  name: string;
  description: string;
  totalBooks: number;
  status: "Active" | "Inactive";
};

export type AdminAuthor = {
  id: number;
  name: string;
  initials: string;
  avatarClass: string;
  nationality: string;
  totalBooks: number;
  status: "Active" | "Inactive";
};

export type AdminPublisher = {
  id: number;
  name: string;
  city: string;
  email: string;
  totalBooks: number;
};

export type AdminUserRole = "Member" | "Librarian" | "Admin";
export type AdminUserStatus = "Active" | "Suspended";

export type AdminUser = {
  id: number;
  name: string;
  initials: string;
  avatarClass: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  joined: string;
  borrows: number;
};
