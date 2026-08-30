import type { AdminPublisher } from "@/types/adminCatalog";

const publishers: AdminPublisher[] = [
  {
    id: 1,
    name: "Penguin Random House",
    city: "New York",
    email: "contact@penguinrandomhouse.com",
    totalBooks: 412,
  },
  {
    id: 2,
    name: "HarperCollins",
    city: "London",
    email: "info@harpercollins.co.uk",
    totalBooks: 287,
  },
  {
    id: 3,
    name: "Simon & Schuster",
    city: "New York",
    email: "trade@simonandschuster.com",
    totalBooks: 198,
  },
  {
    id: 4,
    name: "Ananya Prokashoni",
    city: "Dhaka",
    email: "info@ananya.com.bd",
    totalBooks: 156,
  },
  {
    id: 5,
    name: "O'Reilly Media",
    city: "Sebastopol",
    email: "books@oreilly.com",
    totalBooks: 234,
  },
  {
    id: 6,
    name: "Baatighar",
    city: "Dhaka",
    email: "contact@baatighar.com.bd",
    totalBooks: 89,
  },
];

export async function getPublishersData(
  _adminId: string,
): Promise<AdminPublisher[]> {
  return publishers;
}
