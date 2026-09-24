import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { Book } from "@/Model/Books";
import { Order } from "@/Model/Orders";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

function orderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let index = 0; index < 6; index += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FLO-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;
    const body = await request.json();
    const bookId = String(body.bookId ?? "").trim();
    const quantity = Number(body.quantity);
    const fullName = String(body.fullName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const city = String(body.city ?? "").trim();
    const paymentMethod = String(body.paymentMethod ?? "").trim();
    const transactionId = String(body.transactionId ?? "").trim();

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return new Response(JSON.stringify(new ApiError(400, "Choose a valid book")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!fullName || !phone || !address || !city || !paymentMethod || !transactionId) {
      return new Response(
        JSON.stringify(new ApiError(400, "Delivery and payment details are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return new Response(JSON.stringify(new ApiError(400, "Choose a valid quantity")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const book = await Book.findById(bookId).select("title author coverImage price");
    if (!book) {
      return new Response(JSON.stringify(new ApiError(404, "Book not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const unitPrice = book.price?.amount ?? 0;
    const deliveryFee = 60;
    const order = await Order.create({
      userId,
      bookId,
      orderNumber: orderNumber(),
      bookTitle: book.title,
      author: book.author,
      coverImage: book.coverImage
        ? `/api/uploads/${book.coverImage}`
        : "/svg/book.svg",
      quantity,
      unitPrice,
      deliveryFee,
      currency: book.price?.currency ?? "৳",
      total: unitPrice * quantity + deliveryFee,
      fullName,
      phone,
      address,
      city,
      paymentMethod,
      transactionId,
      status: "processing",
    });

    return new Response(
      JSON.stringify(new ApiResponce(201, order, "Order placed")),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
