import type { MyShelfData } from "@/types/myShelf";

const midnightLibraryCover =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80";

export const fakeShelfData: MyShelfData = {
  userId: "1",
  user: {
    initials: "EA",
    name: "Elara Ashford",
    quote: "A reader lives a thousand lives before she dies.",
    branch: "Riverside Branch",
    memberSince: 2022,
    followers: 48,
    following: 31,
    booksThisYear: 23,
    streakDays: 14,
  },
  stats: [
    {
      id: "books-read",
      label: "Books Read",
      value: 23,
      subtitle: "This year",
      theme: "blue",
    },
    {
      id: "currently-reading",
      label: "Currently Reading",
      value: 1,
      subtitle: "Active borrows",
      theme: "purple",
    },
    {
      id: "want-to-read",
      label: "Want to Read",
      value: 3,
      subtitle: "On wishlist",
      theme: "pink",
    },
    {
      id: "days-streak",
      label: "Days Streak",
      value: 14,
      subtitle: "Keep it up!",
      theme: "amber",
    },
  ],
  tabs: [
    { id: "currently-reading", label: "Currently Reading", count: 1 },
    { id: "completed", label: "Completed", count: 4 },
    { id: "want-to-read", label: "Want to Read", count: 3 },
    { id: "borrowed-history", label: "Borrowed History", count: 4 },
  ],
  currentlyReading: [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
      pages: 288,
      currentPage: 179,
      coverImage: midnightLibraryCover,
      dueDate: "Aug 12",
      daysLeft: 15,
    },
  ],
  completed: [
    {
      id: 2,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      genre: "Sci-Fi",
      pages: 303,
      currentPage: 303,
      coverImage:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
      dueDate: "Jul 2",
      daysLeft: 0,
    },
    {
      id: 3,
      title: "The Vanishing Half",
      author: "Brit Bennett",
      genre: "Literary",
      pages: 343,
      currentPage: 343,
      coverImage:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
      dueDate: "Jun 18",
      daysLeft: 0,
    },
    {
      id: 4,
      title: "Piranesi",
      author: "Susanna Clarke",
      genre: "Fantasy",
      pages: 272,
      currentPage: 272,
      coverImage:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=300&q=80",
      dueDate: "May 30",
      daysLeft: 0,
    },
    {
      id: 5,
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "Sci-Fi",
      pages: 496,
      currentPage: 496,
      coverImage:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=300&q=80",
      dueDate: "Apr 14",
      daysLeft: 0,
    },
  ],
  wantToRead: [
    {
      id: 6,
      title: "Demon Copperhead",
      author: "Barbara Kingsolver",
      genre: "Literary",
      pages: 560,
      currentPage: 0,
      coverImage:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      dueDate: "—",
      daysLeft: 0,
    },
    {
      id: 7,
      title: "The Paris Apartment",
      author: "Lucy Foley",
      genre: "Mystery",
      pages: 381,
      currentPage: 0,
      coverImage:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80",
      dueDate: "—",
      daysLeft: 0,
    },
    {
      id: 8,
      title: "Lessons in Chemistry",
      author: "Bonnie Garmus",
      genre: "Fiction",
      pages: 400,
      currentPage: 0,
      coverImage:
        "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=300&q=80",
      dueDate: "—",
      daysLeft: 0,
    },
  ],
  borrowedHistory: [
    {
      id: 9,
      title: "In the Woods",
      author: "Tana French",
      genre: "Mystery",
      pages: 429,
      currentPage: 429,
      coverImage:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80",
      dueDate: "Mar 8",
      daysLeft: 0,
    },
    {
      id: 10,
      title: "Crying in H Mart",
      author: "Michelle Zauner",
      genre: "Non-Fiction",
      pages: 256,
      currentPage: 256,
      coverImage:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=300&q=80",
      dueDate: "Feb 21",
      daysLeft: 0,
    },
    {
      id: 11,
      title: "The Atlas Six",
      author: "Olivie Blake",
      genre: "Fantasy",
      pages: 384,
      currentPage: 384,
      coverImage:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80",
      dueDate: "Jan 15",
      daysLeft: 0,
    },
    {
      id: 12,
      title: "Orbital",
      author: "Samantha Harvey",
      genre: "Literary",
      pages: 224,
      currentPage: 224,
      coverImage:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=300&q=80",
      dueDate: "Dec 3",
      daysLeft: 0,
    },
  ],
  activity: [
    0, 1, 0, 2, 1, 0, 1, 2, 1, 3, 0, 1, 1, 2, 3, 1, 0, 1, 2, 3, 2, 0, 1, 3, 3,
    1, 2, 3, 2, 1, 0, 2, 3, 1, 2, 3, 1, 2, 0, 1, 3, 2, 1, 3, 0, 2, 3, 1, 0, 1,
    2, 3, 1, 2, 3, 1, 0, 2, 1, 3, 1, 0, 2, 1, 3, 2, 1, 3, 0, 1, 2, 3, 2, 1, 0,
    2, 3, 1, 0, 1, 2, 3, 1, 2, 0,
  ],
  dueDates: [
    {
      id: 1,
      title: "The Midnight Library",
      coverImage: midnightLibraryCover,
      dueDate: "Aug 12",
    },
  ],
  genres: [
    { genre: "Fiction", count: 10, percentage: 43 },
    { genre: "Sci-Fi", count: 5, percentage: 22 },
    { genre: "Literary", count: 4, percentage: 17 },
    { genre: "Mystery", count: 3, percentage: 13 },
    { genre: "Non-Fiction", count: 1, percentage: 5 },
  ],
  people: [],
};

export async function getShelfData(_userId: string): Promise<MyShelfData> {
  return fakeShelfData;
}
