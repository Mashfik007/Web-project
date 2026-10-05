import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { Book } from "@/Model/Books";
import { BookReview } from "@/Model/BookReviews";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
import { BookReview_schema } from "@/Shchema/bookReview";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

async function refreshBookRating(bookId: string) {
  const reviews = await BookReview.find({ bookId })
    .select("rating")
    .lean<{ rating: number }[]>();

  const totalReviews = reviews.length;
  const totalRatings = totalReviews;
  const score =
    totalReviews === 0
      ? 0
      : Math.round(
          (reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews) *
            10,
        ) / 10;

  await Book.updateOne(
    { _id: bookId },
    {
      $set: {
        "rating.score": score,
        "rating.totalRatings": totalRatings,
        "rating.totalReviews": totalReviews,
      },
    },
  );

  return { score, totalRatings, totalReviews };
}

export async function POST(request: Request) {
  try {
    const parsed = BookReview_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(
          new ApiError(400, parsed.error.issues[0]?.message || "Invalid review"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;
    const { bookId, rating } = parsed.data;
    const note = parsed.data.note?.trim() ?? "";

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid book id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();

    const book = await Book.findById(bookId).select("_id title");
    if (!book) {
      return new Response(JSON.stringify(new ApiError(404, "Book not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const returnedLoan = await ShelfLoan.findOne({
      userId,
      bookId,
      status: "returned",
    }).select("_id");

    if (!returnedLoan) {
      return new Response(
        JSON.stringify(
          new ApiError(
            403,
            "You can only review a book after returning it to the library",
          ),
        ),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }

    const account = mongoose.Types.ObjectId.isValid(userId)
      ? await User.findById(userId).select("name").lean<{ name?: string } | null>()
      : null;
    const userName = account?.name?.trim() || "Reader";

    const review = await BookReview.findOneAndUpdate(
      { userId, bookId },
      {
        $set: {
          userId,
          bookId,
          userName,
          rating,
          note,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const bookRating = await refreshBookRating(bookId);

    return new Response(
      JSON.stringify(
        new ApiResponce(
          200,
          {
            review: {
              id: String(review._id),
              userId,
              userName,
              rating,
              note,
              createdAt: review.get("createdAt"),
            },
            bookRating,
          },
          "Review submitted",
        ),
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
