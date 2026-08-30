import Image from "next/image";
import type { CheckoutBook, CheckoutPricing } from "@/types/checkout";

interface OrderSummaryProps {
  book: CheckoutBook;
  pricing: CheckoutPricing;
  quantity: number;
}

export default function OrderSummary({
  book,
  pricing,
  quantity,
}: OrderSummaryProps) {
  const subtotal = book.unitPrice * quantity;
  const total = subtotal + pricing.deliveryFee;

  return (
    <aside className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="card-body gap-4 p-5">
        <h2 className="font-serif text-lg font-bold text-slate-800">
          Order Summary
        </h2>

        <div className="flex gap-3">
          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800">{book.title}</p>
            <p className="text-sm text-sky-600">{book.author}</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {book.currency}
              {book.unitPrice}
            </p>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal ({quantity}x)</span>
            <span>
              {pricing.currency}
              {subtotal}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery</span>
            <span>
              {pricing.currency}
              {pricing.deliveryFee}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-sky-600">
            <span>Total</span>
            <span>
              {pricing.currency}
              {total}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function calculateCheckoutTotal(
  book: CheckoutBook,
  pricing: CheckoutPricing,
  quantity: number,
) {
  return book.unitPrice * quantity + pricing.deliveryFee;
}
