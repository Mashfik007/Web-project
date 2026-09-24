import connectDB from "@/dbConfig/dbConfig";
import { LibraryUser } from "@/Model/LibraryUsers";
import type { AdminUser, AdminUserRole, AdminUserStatus } from "@/types/adminCatalog";

type StoredUser = {
  _id: { toString(): string };
  name: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  borrows?: number;
  createdAt?: string | Date;
};

const avatarClasses = [
  "bg-sky-500 text-white",
  "bg-emerald-500 text-white",
  "bg-violet-500 text-white",
  "bg-amber-500 text-white",
  "bg-cyan-500 text-white",
  "bg-rose-500 text-white",
];

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || name.slice(0, 2).toUpperCase();
}

function avatarClassFrom(name: string) {
  const code = name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return avatarClasses[code % avatarClasses.length];
}

export async function getUsersData(_adminId: string): Promise<AdminUser[]> {
  await connectDB();

  const users = await LibraryUser.find()
    .sort({ createdAt: -1 })
    .lean<StoredUser[]>();

  return users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    initials: initialsFrom(user.name),
    avatarClass: avatarClassFrom(user.name),
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    joined: user.createdAt
      ? new Date(user.createdAt).toISOString().slice(0, 10)
      : "",
    borrows: user.borrows ?? 0,
  }));
}
