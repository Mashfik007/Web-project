import connectDB from "@/dbConfig/dbConfig";
import { publishBorrowUpdate } from "@/Helper/publishBorrow";
import { requireUserId } from "@/Helper/userFromToken";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { PeerBorrowReply_schema } from "@/Shchema/shelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

async function emitPeerBorrow(borrowRequest: {
  _id: { toString(): string };
  status: "Pending" | "Approved" | "Rejected";
  userId?: string;
  ownerId?: string;
  member?: string;
  book?: string;
  bookId?: string;
  requested?: string;
  expectedReturn?: string;
  reason?: string;
}) {
  await publishBorrowUpdate({
    id: borrowRequest._id.toString(),
    action: borrowRequest.status === "Approved" ? "approved" : "rejected",
    scope: "peer",
    status: borrowRequest.status,
    userId: String(borrowRequest.userId || ""),
    ownerId: String(borrowRequest.ownerId || ""),
    member: String(borrowRequest.member || "Reader"),
    book: String(borrowRequest.book || "Book"),
    bookId: String(borrowRequest.bookId || ""),
    requested: String(borrowRequest.requested || ""),
    expectedReturn: String(borrowRequest.expectedReturn || ""),
    reason: borrowRequest.reason || undefined,
  });
}

export async function POST(request: Request) {
  try {
    const parsed = PeerBorrowReply_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, parsed.error.issues[0]?.message || "Invalid reply")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await requireUserId();
    if (session instanceof Response) return session;

    const { requestId, action } = parsed.data;
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid request")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const borrowRequest = await BorrowRequest.findById(requestId);
    if (!borrowRequest || borrowRequest.ownerId !== session) {
      return new Response(JSON.stringify(new ApiError(404, "Borrow request not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (borrowRequest.status !== "Pending") {
      return new Response(JSON.stringify(new ApiError(400, "This request is already decided")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "decline") {
      borrowRequest.status = "Rejected";
      borrowRequest.reason = "Declined by the member";
      borrowRequest.decidedAt = new Date();
      await borrowRequest.save();
      await emitPeerBorrow(borrowRequest);
      return new Response(JSON.stringify(new ApiResponce(200, null, "Request declined")), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const due = new Date();
    due.setDate(due.getDate() + 14);
    const existing = await ShelfLoan.findOne({
      userId: borrowRequest.userId,
      bookId: borrowRequest.bookId,
    });
    if (existing?.status === "reading") {
      return new Response(
        JSON.stringify(new ApiError(400, "They already have this book on their shelf")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    if (existing) {
      existing.status = "reading";
      existing.currentPage = existing.currentPage ?? 0;
      existing.dueDate = due;
      existing.returnedAt = null;
      await existing.save();
    } else {
      await ShelfLoan.create({
        userId: borrowRequest.userId,
        bookId: borrowRequest.bookId,
        status: "reading",
        currentPage: 0,
        dueDate: due,
      });
    }

    borrowRequest.status = "Approved";
    borrowRequest.decidedAt = new Date();
    await borrowRequest.save();
    await emitPeerBorrow(borrowRequest);

    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Request approved. The book is on their shelf.")),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
