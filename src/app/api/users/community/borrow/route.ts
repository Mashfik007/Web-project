import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { Book } from "@/Model/Books";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
import { PeerBorrow_schema } from "@/Shchema/shelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

function formatDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  try {
    const parsed = PeerBorrow_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, parsed.error.issues[0]?.message || "Invalid borrow request")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;
    const { targetId, bookId } = parsed.data;

    if (userId === targetId) {
      return new Response(JSON.stringify(new ApiError(400, "You cannot request a book from yourself")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!mongoose.Types.ObjectId.isValid(targetId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      return new Response(JSON.stringify(new ApiError(400, "Choose a member and a book")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const [sender, owner, book, holding] = await Promise.all([
      User.findById(userId).select("name isAdmin").lean<{ name?: string; isAdmin?: boolean } | null>(),
      User.findById(targetId).select("name isAdmin").lean<{ name?: string; isAdmin?: boolean } | null>(),
      Book.findById(bookId).select("title").lean<{ title?: string } | null>(),
      ShelfLoan.findOne({ userId: targetId, bookId, status: "reading" }).select("_id"),
    ]);

    if (!owner || owner.isAdmin || sender?.isAdmin) {
      return new Response(JSON.stringify(new ApiError(404, "Member not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!book) {
      return new Response(JSON.stringify(new ApiError(404, "Book not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!holding) {
      return new Response(
        JSON.stringify(new ApiError(400, "That member does not have this book out right now")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const already = await BorrowRequest.findOne({
      userId,
      bookId,
      ownerId: targetId,
      status: "Pending",
    });
    if (already) {
      return new Response(JSON.stringify(new ApiError(400, "You already asked this member for this book")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const due = new Date();
    due.setDate(due.getDate() + 14);
    const saved = await BorrowRequest.create({
      member: sender?.name?.trim() || "Reader",
      book: book.title || "Book",
      requested: formatDay(new Date()),
      expectedReturn: formatDay(due),
      status: "Pending",
      userId,
      bookId,
      ownerId: targetId,
    });

    return new Response(
      JSON.stringify(
        new ApiResponce(201, { id: saved._id.toString() }, `Request sent to ${owner.name?.trim() || "that member"}`),
      ),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
