import type { CommunityShelfData } from "@/types/communityShelf";

const midnightLibraryCover =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80";

export const fakeCommunityShelfData: CommunityShelfData = {
  viewerId: "demo",
  header: {
    brand: "FOLIO NETWORK",
    title: "Community Shelf",
    subtitle: "Connect with fellow readers in your area",
  },
  stats: [
    {
      id: "total-books",
      label: "Total Books in Network",
      value: 24817,
      theme: "blue",
    },
    {
      id: "active-members",
      label: "Active Members",
      value: 3204,
      theme: "purple",
    },
    {
      id: "borrowed-month",
      label: "Borrowed This Month",
      value: 892,
      theme: "green",
    },
  ],
  tabs: [
    { id: "local-readers", label: "Local Readers" },
    { id: "friends", label: "Friends" },
    { id: "popular", label: "Popular" },
  ],
  members: [
    {
      id: "1",
      name: "Elena Vasquez",
      initials: "EV",
      avatarColor: "bg-sky-500",
      location: "Riverside District",
      isFriend: true,
      friendStatus: "friends",
      streakDays: 4,
      readingNow: [],
      finished: [],
      booksBorrowed: 41,
      currentlyReading: {
        title: "The Midnight Library",
        author: "Matt Haig",
        coverImage: midnightLibraryCover,
      },
    },
    {
      id: "2",
      name: "Marcus Chen",
      initials: "MC",
      avatarColor: "bg-violet-500",
      location: "Westside Branch",
      isFriend: true,
      friendStatus: "friends",
      streakDays: 4,
      readingNow: [],
      finished: [],
      booksBorrowed: 38,
      currentlyReading: {
        title: "Project Hail Mary",
        author: "Andy Weir",
        coverImage:
          "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=300&q=80",
      },
    },
    {
      id: "3",
      name: "Priya Nair",
      initials: "PN",
      avatarColor: "bg-emerald-500",
      location: "Northside Library",
      isFriend: true,
      friendStatus: "friends",
      streakDays: 4,
      readingNow: [],
      finished: [],
      booksBorrowed: 29,
      currentlyReading: {
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        coverImage:
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
      },
    },
    {
      id: "4",
      name: "James Torres",
      initials: "JT",
      avatarColor: "bg-amber-500",
      location: "Downtown Hub",
      isFriend: true,
      friendStatus: "friends",
      streakDays: 4,
      readingNow: [],
      finished: [],
      booksBorrowed: 52,
      currentlyReading: {
        title: "Piranesi",
        author: "Susanna Clarke",
        coverImage:
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=300&q=80",
      },
    },
    {
      id: "5",
      name: "Sofia Reyes",
      initials: "SR",
      avatarColor: "bg-rose-500",
      location: "Riverside District",
      isFriend: true,
      friendStatus: "friends",
      streakDays: 4,
      readingNow: [],
      finished: [],
      booksBorrowed: 33,
      currentlyReading: {
        title: "The Vanishing Half",
        author: "Brit Bennett",
        coverImage:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
      },
    },
    {
      id: "6",
      name: "David Kim",
      initials: "DK",
      avatarColor: "bg-indigo-500",
      location: "Westside Branch",
      isFriend: true,
      friendStatus: "friends",
      streakDays: 4,
      readingNow: [],
      finished: [],
      booksBorrowed: 27,
      currentlyReading: {
        title: "Lessons in Chemistry",
        author: "Bonnie Garmus",
        coverImage:
          "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=300&q=80",
      },
    },
  ],
  borrowRequests: [
    {
      id: "1",
      requestedFrom: "Elena Vasquez",
      bookTitle: "The Midnight Library",
      currentStep: "on-loan",
      dotColor: "bg-sky-500",
    },
    {
      id: "2",
      requestedFrom: "Marcus Chen",
      bookTitle: "Project Hail Mary",
      currentStep: "approved",
      dotColor: "bg-violet-500",
    },
    {
      id: "3",
      requestedFrom: "Priya Nair",
      bookTitle: "Klara and the Sun",
      currentStep: "pending",
      dotColor: "bg-emerald-500",
    },
    {
      id: "4",
      requestedFrom: "James Torres",
      bookTitle: "Piranesi",
      currentStep: "returned",
      dotColor: "bg-amber-500",
    },
    {
      id: "5",
      requestedFrom: "Sofia Reyes",
      bookTitle: "The Vanishing Half",
      currentStep: "approved",
      dotColor: "bg-rose-500",
    },
  ],
  activeRequestCount: 5,
  readingFeed: [
    {
      id: "1",
      userName: "Elena V.",
      initials: "EV",
      avatarColor: "bg-sky-500",
      timeAgo: "12 min ago",
      likes: 4,
      book: {
        title: "The Midnight Library",
        author: "Matt Haig",
        coverImage: midnightLibraryCover,
      },
      progressPercent: 75,
      quote: "Every life path Nora explores feels achingly real.",
    },
    {
      id: "2",
      userName: "Marcus C.",
      initials: "MC",
      avatarColor: "bg-violet-500",
      timeAgo: "28 min ago",
      likes: 2,
      book: {
        title: "Project Hail Mary",
        author: "Andy Weir",
        coverImage:
          "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=300&q=80",
      },
      progressPercent: 42,
      quote: "Rocky is the best co-pilot in sci-fi history.",
    },
    {
      id: "3",
      userName: "Priya N.",
      initials: "PN",
      avatarColor: "bg-emerald-500",
      timeAgo: "1 hr ago",
      likes: 6,
      book: {
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        coverImage:
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
      },
      progressPercent: 88,
      quote: "Klara's observations are quietly devastating.",
    },
    {
      id: "4",
      userName: "James T.",
      initials: "JT",
      avatarColor: "bg-amber-500",
      timeAgo: "2 hr ago",
      likes: 3,
      book: {
        title: "Piranesi",
        author: "Susanna Clarke",
        coverImage:
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=300&q=80",
      },
      progressPercent: 55,
      quote: "The House feels like a character itself.",
    },
    {
      id: "5",
      userName: "Sofia R.",
      initials: "SR",
      avatarColor: "bg-rose-500",
      timeAgo: "3 hr ago",
      likes: 5,
      book: {
        title: "The Vanishing Half",
        author: "Brit Bennett",
        coverImage:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
      },
      progressPercent: 31,
      quote: "Identity and family secrets woven beautifully.",
    },
    {
      id: "6",
      userName: "David K.",
      initials: "DK",
      avatarColor: "bg-indigo-500",
      timeAgo: "5 hr ago",
      likes: 1,
      book: {
        title: "Lessons in Chemistry",
        author: "Bonnie Garmus",
        coverImage:
          "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=300&q=80",
      },
      progressPercent: 67,
      quote: "Elizabeth Zott is an unforgettable protagonist.",
    },
  ],
};

export async function getCommunityShelfData(
  _userId: string,
): Promise<CommunityShelfData> {
  return fakeCommunityShelfData;
}
