import Image from "next/image";
import Link from "next/link";
import type { BookDetails } from "@/types/bookDetails";

interface PurchaseCardProps {
  price: BookDetails["price"];
  checkoutHref: string;
}

export default function PurchaseCard({
  price,
  checkoutHref,
}: PurchaseCardProps) {
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
        className="btn btn-block bg-base-100 text-primary hover:bg-base-200 mt-5"
      >
        <Image
          src="/svg/cart.svg"
          alt="Cart"
          width={16}
          height={16}
          className="size-4"
        />
        Buy Now
      </Link>
    </div>
  );
}
