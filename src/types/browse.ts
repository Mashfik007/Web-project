import type { Book } from "@/types/book";

export type BrowsePageData = {
  userId: string;
  title: string;
  subtitle: string;
  totalCatalogCount: number;
  books: Book[];
};
