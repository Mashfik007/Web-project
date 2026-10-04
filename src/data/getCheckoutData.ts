import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { User } from "@/Model/Users";
import type { CheckoutData } from "@/types/checkout";
import mongoose from "mongoose";

const receiverNumber = "01921591087";

const defaultPaymentMethods: CheckoutData["paymentMethods"] = [
  {
    id: "bkash",
    name: "bKash",
    logoSrc: "/payments/bkash.png",
    accentClass: "text-pink-600",
    borderActiveClass: "border-pink-400 ring-2 ring-pink-100",
    panelClass: "bg-pink-50 border-pink-100",
    copyButtonClass: "bg-pink-500 hover:bg-pink-600",
    merchantNumber: receiverNumber,
    instructions: [
      "Scan the QR code, or open bKash and tap Send Money.",
      "Send the exact total amount from your order summary.",
      "Complete the payment and copy the Transaction ID.",
      "Enter the Transaction ID and phone, then tap I Paid — Save Order.",
      "Your order is saved in the database right away.",
    ],
  },
  {
    id: "rocket",
    name: "Rocket",
    logoSrc: "/payments/rocket.png",
    accentClass: "text-violet-600",
    borderActiveClass: "border-violet-400 ring-2 ring-violet-100",
    panelClass: "bg-violet-50 border-violet-100",
    copyButtonClass: "bg-violet-600 hover:bg-violet-700",
    merchantNumber: receiverNumber,
    instructions: [
      "Scan the QR code, or open Rocket and choose Send Money.",
      "Send the exact order total amount.",
      "Save the Transaction ID from the confirmation screen.",
      "Enter the Transaction ID and phone, then tap I Paid — Save Order.",
      "Your order is saved in the database right away.",
    ],
  },
];

type CheckoutBookRecord = {
  _id: { toString(): string };
  title: string;
  author: string;
  coverImage?: string;
  price?: {
    amount?: number;
    currency?: string;
  };
};

export async function getCheckoutData(
  userId: string,
  bookId: string,
): Promise<CheckoutData | null> {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return null;
  }

  await connectDB();
  const [book, account] = await Promise.all([
    Book.findById(bookId).lean<CheckoutBookRecord | null>(),
    mongoose.Types.ObjectId.isValid(userId)
      ? User.findById(userId).select("name email").lean<{ name?: string; email?: string } | null>()
      : Promise.resolve(null),
  ]);

  if (!book) {
    return null;
  }

  const currency = book.price?.currency ?? "৳";

  return {
    userId,
    payer: {
      id: userId,
      name: account?.name?.trim() || "Member",
      email: account?.email?.trim() || "",
    },
    title: "Checkout",
    subtitle: "Complete your purchase securely",
    book: {
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      coverImage: book.coverImage
        ? `/api/uploads/${book.coverImage}`
        : "/svg/book.svg",
      unitPrice: book.price?.amount ?? 0,
      currency,
    },
    pricing: {
      deliveryFee: 60,
      currency,
    },
    delivery: {
      cities: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"],
      defaultCity: "Dhaka",
      estimatedDelivery: "2–5 business days · Dhaka",
    },
    paymentMethods: defaultPaymentMethods,
    backHref: `/user/${userId}/browsebook/${bookId}`,
    ordersHref: `/user/${userId}/orders`,
    browseHref: `/user/${userId}/browsebook`,
  };
}
