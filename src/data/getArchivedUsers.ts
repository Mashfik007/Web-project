import connectDB from "@/dbConfig/dbConfig";
import { ArchivedLibraryUser } from "@/Model/ArchivedLibraryUsers";
import { User } from "@/Model/Users";

export type ArchivedUserItem = {
  id: string;
  name: string;
};

type StoredArchive = {
  _id: { toString(): string };
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
};

export async function getArchivedUsers(): Promise<ArchivedUserItem[]> {
  await connectDB();

  const [archives, adminAccounts] = await Promise.all([
    ArchivedLibraryUser.find().sort({ archivedAt: -1 }).lean<StoredArchive[]>(),
    User.find({ isAdmin: true }).select("email").lean<{ email?: string }[]>(),
  ]);

  const adminEmails = new Set(
    adminAccounts
      .map((account) => account.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email)),
  );

  return archives
    .filter((archive) => {
      const role = archive.user?.role;
      const email = archive.user?.email?.trim().toLowerCase();
      return role !== "Admin" && !(email && adminEmails.has(email));
    })
    .map((archive) => ({
      id: archive._id.toString(),
      name: archive.user?.name || "Untitled",
    }));
}
