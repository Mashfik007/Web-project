import type { AdminAuthor } from "@/types/adminCatalog";

const authors: AdminAuthor[] = [
  {
    id: 1,
    name: "George Orwell",
    initials: "GO",
    avatarClass: "bg-sky-100 text-sky-700",
    nationality: "British",
    totalBooks: 8,
    status: "Active",
  },
  {
    id: 2,
    name: "Yuval Noah Harari",
    initials: "YH",
    avatarClass: "bg-violet-100 text-violet-700",
    nationality: "Palestinian",
    totalBooks: 4,
    status: "Active",
  },
  {
    id: 3,
    name: "Stephen Hawking",
    initials: "SH",
    avatarClass: "bg-rose-100 text-rose-700",
    nationality: "British",
    totalBooks: 7,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Humayun Ahmed",
    initials: "HA",
    avatarClass: "bg-emerald-100 text-emerald-700",
    nationality: "Bangladeshi",
    totalBooks: 23,
    status: "Active",
  },
  {
    id: 5,
    name: "Matt Haig",
    initials: "MH",
    avatarClass: "bg-amber-100 text-amber-700",
    nationality: "British",
    totalBooks: 6,
    status: "Active",
  },
  {
    id: 6,
    name: "Andy Weir",
    initials: "AW",
    avatarClass: "bg-cyan-100 text-cyan-700",
    nationality: "American",
    totalBooks: 3,
    status: "Active",
  },
];

export async function getAuthorsData(_adminId: string): Promise<AdminAuthor[]> {
  return authors;
}
