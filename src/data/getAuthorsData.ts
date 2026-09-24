import connectDB from "@/dbConfig/dbConfig";
import { Author } from "@/Model/Authors";
import { Book } from "@/Model/Books";
import type { AdminAuthor } from "@/types/adminCatalog";

type StoredAuthor = {
  _id: { toString(): string };
  name: string;
  nationality: string;
  status: "Active" | "Inactive";
};

const avatarClasses = [
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-cyan-100 text-cyan-700",
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

export async function getAuthorsData(_adminId: string): Promise<AdminAuthor[]> {
  await connectDB();

  const [authors, counts] = await Promise.all([
    Author.find().sort({ createdAt: -1 }).lean<StoredAuthor[]>(),
    Book.aggregate<{ _id: string; total: number }>([
      { $group: { _id: "$author", total: { $sum: 1 } } },
    ]),
  ]);

  const totals = new Map(
    counts.map((count) => [count._id?.toLowerCase() ?? "", count.total]),
  );

  return authors.map((author) => ({
    id: author._id.toString(),
    name: author.name,
    initials: initialsFrom(author.name),
    avatarClass: avatarClassFrom(author.name),
    nationality: author.nationality,
    totalBooks: totals.get(author.name.toLowerCase()) ?? 0,
    status: author.status,
  }));
}
