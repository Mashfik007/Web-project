import Image from "next/image";
import checkCircleIcon from "@svg/check-circle.svg";
import Link from "next/link";
import type { PlacedOrder } from "@/types/checkout";

interface OrderSuccessProps {
  order: PlacedOrder;
  ordersHref: string;
  browseHref: string;
}

export default function OrderSuccess({
  order,
  ordersHref,
  browseHref,
}: OrderSuccessProps) {
  return (
    <section className="card mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="card-body items-center gap-5 p-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <Image
            src={checkCircleIcon}
            alt="Success"
            width={32}
            height={32}
            className="size-8"
          />
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-800">
            Order Placed!
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Your order has been confirmed and is being processed.
          </p>
        </div>

        <div className="w-full rounded-xl bg-sky-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4 py-2">
            <span className="text-sky-600">Order ID</span>
            <span className="font-semibold text-slate-800">
              {order.orderId}
            </span>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span className="text-sky-600">Book</span>
            <span className="font-semibold text-slate-800">
              {order.bookTitle}
            </span>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span className="text-sky-600">Total Paid</span>
            <span className="font-semibold text-slate-800">
              {order.currency}
              {order.totalPaid}
            </span>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <span className="text-sky-600">Payment</span>
            <span className="font-semibold text-slate-800">
              {order.paymentMethod}
            </span>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <Link href={ordersHref} className="btn btn-primary">
            View My Orders
          </Link>
          <Link href={browseHref} className="btn btn-outline btn-primary">
            Keep Browsing
          </Link>
        </div>
      </div>
    </section>
  );
}

function generateOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let index = 0; index < 6; index += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FLO-${suffix}`;
}

export { generateOrderId };
