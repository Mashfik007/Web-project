import Link from "next/link";
import type { BookDetails } from "@/types/bookDetails";

interface PurchaseCardProps {
  price: BookDetails["price"];
  checkoutHref: string;
}

export default function PurchaseCard({ price, checkoutHref }: PurchaseCardProps) {
  return (
    <div className="rounded-2xl bg-sky-500 p-5 text-white shadow-lg">
      <p className="text-[10px] font-semibold tracking-widest uppercase">
        Own This Book
      </p>

      <p className="mt-3 font-serif text-4xl font-bold">
        {price.currency} {price.amount}
      </p>

      <p className="mt-2 text-xs text-sky-100">
        Ships in 2–4 business days. Free delivery on orders over ৳500.
      </p>

      <Link
        href={checkoutHref}
        className="mt-5 btn btn-block bg-base-100 text-primary hover:bg-base-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        Buy Now
      </Link>
    </div>
  );
}
