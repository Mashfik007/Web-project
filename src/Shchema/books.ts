import z from "zod";

export const Book_shema = z.object({
  title: z.string().min(1, "title is required"),
  author: z.string().min(1, "author is required"),
  coverImage: z.string().min(1, "cover image is required"),
  tags: z.array(z.string()),
  rating: z.object({
    score: z.number().min(0).max(5),
    totalRatings: z.number().min(0),
    totalReviews: z.number().min(0),
  }),
  description: z.string().min(1, "description is required"),
  price: z.object({
    amount: z.number().min(0),
    currency: z.string().min(1),
  }),
  availability: z.object({
    current: z.number().min(0),
    total: z.number().min(0),
  }),
  metadata: z.object({
    publisher: z.string().min(1),
    language: z.string().min(1),
    series: z.string().min(1),
    isbn: z.string().min(1),
    published: z.number(),
    copiesHeld: z.string().min(1),
    pages: z.number().min(1),
    category: z.string().min(1),
    deweyDecimal: z.string().min(1),
  }),
  community: z.object({
    totalOnShelf: z.number().min(0),
    members: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        initials: z.string(),
        color: z.string(),
      }),
    ),
  }),
  matchScore: z.object({
    score: z.number().min(0),
    maxScore: z.number().min(0),
    label: z.string().min(1),
    description: z.string().min(1),
  }),
});
