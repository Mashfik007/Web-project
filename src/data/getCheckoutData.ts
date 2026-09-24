import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import type { CheckoutData } from "@/types/checkout";
import mongoose from "mongoose";

const defaultPaymentMethods: CheckoutData["paymentMethods"] = [
  {
    id: "bkash",
    name: "bKash",
    logoSrc: "/payments/bkash.png",
    accentClass: "text-pink-600",
    borderActiveClass: "border-pink-400 ring-2 ring-pink-100",
    panelClass: "bg-pink-50 border-pink-100",
    copyButtonClass: "bg-pink-500 hover:bg-pink-600",
    merchantNumber: "017XXXXXXXX",
    instructions: [
      "Open your bKash app and tap Send Money.",
      "Enter the merchant number shown above.",
      "Enter the exact total amount from your order summary.",
      "Complete the payment and copy the Transaction ID.",
      "Paste the Transaction ID and phone number below.",
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
    merchantNumber: "019XXXXXXXX",
    instructions: [
      "Open Rocket app and choose Send Money.",
      "Enter the merchant number shown above.",
      "Send the exact order total amount.",
      "Save the Transaction ID from the confirmation screen.",
      "Enter the Transaction ID and your Rocket number below.",
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
  const book = await Book.findById(bookId).lean<CheckoutBookRecord | null>();

  if (!book) {
    return null;
  }

  const currency = book.price?.currency ?? "৳";

  return {
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
