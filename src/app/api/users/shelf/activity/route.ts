import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { Book } from "@/Model/Books";
import { ReadingActivity } from "@/Model/ReadingActivities";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { ReadingLog_schema } from "@/Shchema/shelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishShelfUpdate } from "@/Helper/publishDomain";

export async function POST(request: Request) {
  try {
    const parsed = ReadingLog_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, parsed.error.issues[0]?.message || "Invalid reading log")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;
    const { loanId, page } = parsed.data;
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid loan id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const loan = await ShelfLoan.findOne({ _id: loanId, userId, status: "reading" });
    if (!loan) {
      return new Response(
        JSON.stringify(new ApiError(404, "Choose a book you are reading")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const book = mongoose.Types.ObjectId.isValid(loan.bookId)
      ? await Book.findById(loan.bookId).select("metadata.pages").lean<{
          metadata?: { pages?: number };
        } | null>()
      : null;
    const pages = book?.metadata?.pages ?? 0;
    if (pages > 0 && page > pages) {
      return new Response(
        JSON.stringify(new ApiError(400, `Page must be ${pages} or less`)),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    loan.currentPage = page;
    const finished = pages > 0 && page >= pages;
    await loan.save();
    await ReadingActivity.create({
      userId,
      bookId: loan.bookId,
      loanId,
      hours: 1,
      page,
      loggedAt: new Date(),
    });

    await publishShelfUpdate({ action: "activity", userId: String(userId), bookId: String(loan.bookId || "") });
    return new Response(
      JSON.stringify(
        new ApiResponce(
          201,
          { hours: 1, page, finished },
          finished
            ? "You finished this book. It is now in Completed."
            : "Logged 1 hour of reading",
        ),
      ),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
