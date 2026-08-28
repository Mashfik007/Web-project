import type { BorrowRequestsData } from "@/types/borrowRequests";

export const fakeBorrowRequestsData: BorrowRequestsData = {
  title: "Borrow Requests",
  subtitle: "Members who want to borrow books from your shelf",
  filters: [
    { id: "all", label: "All", status: "all", count: 5 },
    { id: "pending", label: "Pending", status: "pending", count: 3 },
    { id: "approved", label: "Approved", status: "approved", count: 1 },
    { id: "declined", label: "Declined", status: "declined", count: 1 },
  ],
  requests: [
    {
      id: "1",
      userName: "Marcus Chen",
      initials: "MC",
      avatarColor: "bg-secondary text-secondary-content",
      bookTitle: "The Midnight Library",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80",
      status: "pending",
      requestedAt: "2h ago",
    },
    {
      id: "2",
      userName: "Priya Nair",
      initials: "PN",
      avatarColor: "bg-accent text-accent-content",
      bookTitle: "Project Hail Mary",
      coverImage:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=200&q=80",
      status: "pending",
      requestedAt: "5h ago",
    },
    {
      id: "3",
      userName: "Elena Vasquez",
      initials: "EV",
      avatarColor: "bg-info text-info-content",
      bookTitle: "Klara and the Sun",
      coverImage:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=200&q=80",
      status: "pending",
      requestedAt: "Yesterday",
    },
    {
      id: "4",
      userName: "James Torres",
      initials: "JT",
      avatarColor: "bg-warning text-warning-content",
      bookTitle: "Piranesi",
      coverImage:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=200&q=80",
      status: "approved",
      requestedAt: "2 days ago",
    },
    {
      id: "5",
      userName: "Sofia Reyes",
      initials: "SR",
      avatarColor: "bg-error text-error-content",
      bookTitle: "The Vanishing Half",
      coverImage:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80",
      status: "declined",
      requestedAt: "3 days ago",
    },
  ],
};

export async function getBorrowRequestsData(
  _userId: string,
): Promise<BorrowRequestsData> {
  return fakeBorrowRequestsData;
}
