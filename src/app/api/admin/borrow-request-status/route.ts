import connectDB from "@/dbConfig/dbConfig";
import { recordMemberBorrow } from "@/data/libraryLink";
import { publishBorrowUpdate } from "@/Helper/publishBorrow";
import { sendFolioEmail } from "@/Helper/sendFolioEmail";
import { Book } from "@/Model/Books";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { LibraryUser } from "@/Model/LibraryUsers";
import { Reservation } from "@/Model/Reservations";
import { ReturnRecord } from "@/Model/Returns";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id, action, reason } = await request.json();
    const rejectionReason = String(reason ?? "").trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid request id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action !== "approve" && action !== "reject") {
      return new Response(JSON.stringify(new ApiError(400, "Invalid action")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const borrowRequest = await BorrowRequest.findById(id);
    if (!borrowRequest) {
      return new Response(
        JSON.stringify(new ApiError(404, "Borrow request not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    if (borrowRequest.ownerId) {
      return new Response(
        JSON.stringify(new ApiError(400, "Member-to-member requests are decided by the reader")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (borrowRequest.status !== "Pending") {
      return new Response(
        JSON.stringify(new ApiError(400, "This request has already been decided")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (action === "reject" && !rejectionReason) {
      return new Response(
        JSON.stringify(new ApiError(400, "A reason is required to reject this request")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    borrowRequest.status = action === "approve" ? "Approved" : "Rejected";
    borrowRequest.decidedAt = new Date();
    if (action === "reject") {
      borrowRequest.reason = rejectionReason;
    }
    await borrowRequest.save();

    if (borrowRequest.status === "Rejected") {
      const loan = await ShelfLoan.findOne({
        userId: borrowRequest.userId,
        bookId: borrowRequest.bookId,
        status: "reading",
      });
      if (loan && (loan.currentPage ?? 0) === 0) {
        const requestCreated = borrowRequest.createdAt
          ? new Date(borrowRequest.createdAt).getTime()
          : 0;
        const loanCreated = loan.createdAt
          ? new Date(loan.createdAt).getTime()
          : 0;
        const wasAlreadyOnShelf =
          Boolean(loan.blindDate) || loanCreated < requestCreated - 60_000;

        if (wasAlreadyOnShelf) {
          loan.status = "wishlist";
          loan.dueDate = null;
          await loan.save();
        } else {
          await ShelfLoan.deleteOne({ _id: loan._id });
        }

        const book = await Book.findById(borrowRequest.bookId);
        if (book && book.availability) {
          book.availability.current += 1;
          await book.save();
        }
      }
    }

    if (borrowRequest.status === "Approved") {
      const book = await Book.findById(borrowRequest.bookId);
      const loan = borrowRequest.userId
        ? await ShelfLoan.findOne({
            userId: borrowRequest.userId,
            bookId: borrowRequest.bookId,
          })
        : null;
      const alreadyReading = loan?.status === "reading";

      if (!alreadyReading && (book?.availability?.current ?? 0) <= 0) {
        borrowRequest.status = "Pending";
        borrowRequest.decidedAt = null;
        await borrowRequest.save();
        return new Response(
          JSON.stringify(new ApiError(400, "No copies are available")),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (book && !alreadyReading && book.availability) {
        book.availability.current -= 1;
        await book.save();
      }

      const dueDate = new Date(borrowRequest.expectedReturn);
      const shelfLoan =
        loan ??
        new ShelfLoan({
          userId: borrowRequest.userId,
          bookId: borrowRequest.bookId,
          currentPage: 0,
        });
      shelfLoan.status = "reading";
      shelfLoan.dueDate = Number.isNaN(dueDate.getTime()) ? new Date() : dueDate;
      shelfLoan.returnedAt = null;
      if (!alreadyReading) shelfLoan.currentPage = 0;
      await shelfLoan.save();
      if (!alreadyReading && borrowRequest.userId) {
        await recordMemberBorrow(borrowRequest.userId);
      }

      const existingReturn = await ReturnRecord.findOne({
        borrowRequestId: borrowRequest._id,
      });
      const existingHold = await Reservation.findOne({
        borrowRequestId: borrowRequest._id,
      });
      if (!existingReturn && !existingHold) {
        const openLoan = await ReturnRecord.findOne({
          book: borrowRequest.book,
          status: { $ne: "Returned" },
        });
        if (openLoan) {
          await Reservation.create({
            member: borrowRequest.member,
            book: borrowRequest.book,
            reservedDate: borrowRequest.requested,
            status: "Waiting",
            borrowRequestId: borrowRequest._id,
          });
        } else {
          await ReturnRecord.create({
            member: borrowRequest.member,
            book: borrowRequest.book,
            issueDate: borrowRequest.requested,
            dueDate: borrowRequest.expectedReturn,
            status: "Active",
            borrowRequestId: borrowRequest._id,
            userId: borrowRequest.userId,
            bookId: borrowRequest.bookId,
          });
        }
      }
    }

    if (borrowRequest.status === "Rejected") {
      try {
        let email = "";
        let name = borrowRequest.member;

        if (borrowRequest.userId && mongoose.Types.ObjectId.isValid(borrowRequest.userId)) {
          const authUser = await User.findById(borrowRequest.userId).select("email name");
          if (authUser?.email) {
            email = authUser.email;
            name = authUser.name || name;
          }
        }

        if (!email) {
          const libraryUser = await LibraryUser.findOne({
            name: borrowRequest.member,
          }).select("email name");
          if (libraryUser?.email) {
            email = libraryUser.email;
            name = libraryUser.name || name;
          }
        }

        if (email) {
          await sendFolioEmail({
            email,
            name,
            type: "borrow_cancelled",
            bookTitle: borrowRequest.book,
            reason: borrowRequest.reason,
          });
        }
      } catch (error) {
        console.error("[borrow-request-status] Cancel email failed:", error);
      }
    }

    const message =
      borrowRequest.status === "Approved"
        ? "Request approved"
        : "Request rejected";

    await publishBorrowUpdate({
      id: String(borrowRequest._id),
      action: borrowRequest.status === "Approved" ? "approved" : "rejected",
      scope: "library",
      status: borrowRequest.status,
      userId: String(borrowRequest.userId || ""),
      member: String(borrowRequest.member || "Reader"),
      book: String(borrowRequest.book || "Book"),
      bookId: String(borrowRequest.bookId || ""),
      requested: String(borrowRequest.requested || ""),
      expectedReturn: String(borrowRequest.expectedReturn || ""),
      reason: borrowRequest.reason || undefined,
    });

    return new Response(
      JSON.stringify(new ApiResponce(200, borrowRequest, message)),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        new ApiError(500, error.message || "Internal Server Error"),
      ),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
