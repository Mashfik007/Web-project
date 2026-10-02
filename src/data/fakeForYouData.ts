import type { ForYouData } from "@/types/forYou";

export const fakeForYouData: ForYouData = {
  header: {
    label: "CURATED FOR YOU",
    title: "Your",
    titleAccent: "Personalized Remix.",
    description:
      "Based on 23 books read this year. We've analysed your borrowing patterns and found what you'll love next.",
    topCategories: [
      { rank: 1, category: "Fiction", percentage: 43, color: "#0ea5e9" },
      { rank: 2, category: "Sci-Fi", percentage: 22, color: "#8b5cf6" },
    ],
  },
  borrowingHabits: {
    totalBooks: 23,
    months: 12,
    categoryCount: 5,
    categories: [
      { category: "Fiction", count: 10, percentage: 43, color: "#0ea5e9" },
      { category: "Sci-Fi", count: 5, percentage: 22, color: "#8b5cf6" },
      { category: "Literary", count: 4, percentage: 17, color: "#f43f5e" },
      { category: "Mystery", count: 3, percentage: 13, color: "#f59e0b" },
      { category: "Non-Fiction", count: 1, percentage: 5, color: "#14b8a6" },
    ],
    blendSlider: {
      leftLabel: "Fiction",
      rightLabel: "Sci-Fi",
      value: 50,
      balanceLabel: "Balanced Mix",
      hint: "Drag to tune recommendations between your top categories.",
    },
  },
  sections: [
    {
      id: "perfect-mix",
      title: "Perfect Mix",
      description:
        "Books that combine Fiction and Sci-Fi — your top two categories",
      highlightCategories: ["Fiction", "Sci-Fi"],
      badge: "Perfectly balanced",
      iconTheme: "blue",
      books: [
        {
          id: 1,
          title: "The Midnight Library",
          author: "Matt Haig",
          coverImage:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
          rating: 4.8,
          matchPercent: 97,
        },
        {
          id: 2,
          title: "Project Hail Mary",
          author: "Andy Weir",
          coverImage:
            "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=400&q=80",
          rating: 4.8,
          matchPercent: 94,
        },
        {
          id: 3,
          title: "Klara and the Sun",
          author: "Kazuo Ishiguro",
          coverImage:
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80",
          rating: 4.6,
          matchPercent: 91,
        },
        {
          id: 4,
          title: "The Vanishing Half",
          author: "Brit Bennett",
          coverImage:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
          rating: 4.7,
          matchPercent: 88,
        },
      ],
    },
    {
      id: "try-something-new",
      title: "Try Something New",
      description:
        "Outside your comfort zone — but rated highly by readers just like you",
      iconTheme: "orange",
      books: [
        {
          id: 5,
          title: "Crying in H Mart",
          author: "Michelle Zauner",
          coverImage:
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80",
          rating: 4.5,
          matchPercent: 85,
          category: "Non-Fiction",
          isNew: true,
        },
        {
          id: 6,
          title: "The Seven Husbands of Evelyn Hugo",
          author: "Taylor Jenkins Reid",
          coverImage:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80",
          rating: 4.6,
          matchPercent: 82,
          category: "Romance",
          isNew: true,
        },
        {
          id: 7,
          title: "Piranesi",
          author: "Susanna Clarke",
          coverImage:
            "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80",
          rating: 4.9,
          matchPercent: 79,
          category: "Fantasy",
          isNew: true,
        },
        {
          id: 8,
          title: "Lessons in Chemistry",
          author: "Bonnie Garmus",
          coverImage:
            "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=400&q=80",
          rating: 4.6,
          matchPercent: 76,
          category: "Fiction",
          isNew: true,
        },
      ],
    },
  ],
  exploreCategories: [
    {
      id: "fiction",
      label: "Fiction",
      color: "#0ea5e9",
      backgroundColor: "#e0f2fe",
    },
    {
      id: "sci-fi",
      label: "Sci-Fi",
      color: "#8b5cf6",
      backgroundColor: "#ede9fe",
    },
    {
      id: "mystery",
      label: "Mystery",
      color: "#f59e0b",
      backgroundColor: "#fef3c7",
    },
    {
      id: "fantasy",
      label: "Fantasy",
      color: "#10b981",
      backgroundColor: "#d1fae5",
    },
    {
      id: "literary",
      label: "Literary",
      color: "#f43f5e",
      backgroundColor: "#ffe4e6",
    },
    {
      id: "romance",
      label: "Romance",
      color: "#ec4899",
      backgroundColor: "#fce7f3",
    },
    {
      id: "non-fiction",
      label: "Non-Fiction",
      color: "#14b8a6",
      backgroundColor: "#ccfbf1",
    },
  ],
  catalogHref: "/browse",
};

export async function getForYouData(userId: string): Promise<ForYouData> {
  return {
    ...fakeForYouData,
    catalogHref: `/user/${userId}/browsebook`,
  };
}
