export type BookCommunityMember = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export type BookReviewItem = {
  id: string;
  userId: string;
  userName: string;
  initials: string;
  rating: number;
  note: string;
  createdAt: string;
};

export type BookDetails = {
  id: string | number;
  title: string;
  author: string;
  coverImage: string;
  tags: string[];
  rating: {
    score: number;
    totalRatings: number;
    totalReviews: number;
  };
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  availability: {
    current: number;
    total: number;
  };
  metadata: {
    publisher: string;
    language: string;
    series: string;
    isbn: string;
    published: number;
    copiesHeld: string;
    pages: number;
    category: string;
    deweyDecimal: string;
  };
  community: {
    totalOnShelf: number;
    members: BookCommunityMember[];
  };
  matchScore: {
    score: number;
    maxScore: number;
    label: string;
    description: string;
  };
  reviews: BookReviewItem[];
  canReview: boolean;
  viewerReview: BookReviewItem | null;
};
