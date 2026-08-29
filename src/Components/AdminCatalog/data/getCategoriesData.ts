import type { AdminCategory } from "@/types/adminCatalog";

const categories: AdminCategory[] = [
  {
    id: 1,
    name: "Fiction",
    description: "Novels, short stories, and imaginative works",
    totalBooks: 487,
    status: "Active",
  },
  {
    id: 2,
    name: "Non-Fiction",
    description: "Essays, memoirs, and factual writing",
    totalBooks: 879,
    status: "Active",
  },
  {
    id: 3,
    name: "Science",
    description: "Physics, biology, and popular science",
    totalBooks: 312,
    status: "Active",
  },
  {
    id: 4,
    name: "Technology",
    description: "Programming, design, and digital culture",
    totalBooks: 254,
    status: "Active",
  },
  {
    id: 5,
    name: "History",
    description: "World history and historical biographies",
    totalBooks: 198,
    status: "Active",
  },
  {
    id: 6,
    name: "Art",
    description: "Fine art, photography, and design",
    totalBooks: 76,
    status: "Inactive",
  },
  {
    id: 7,
    name: "Children",
    description: "Picture books and early readers",
    totalBooks: 143,
    status: "Active",
  },
  {
    id: 8,
    name: "Biography",
    description: "Lives of notable people",
    totalBooks: 121,
    status: "Inactive",
  },
];

export async function getCategoriesData(
  _adminId: string,
): Promise<AdminCategory[]> {
  return categories;
}
