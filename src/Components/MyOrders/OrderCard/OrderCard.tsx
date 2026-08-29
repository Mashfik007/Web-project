import Image from "next/image";
import OrderStepper from "../OrderStepper/OrderStepper";
import {
  ORDER_STATUS_LABEL,
  type DeliveryAgent,
  type Order,
  type OrderItem,
} from "@/types/myOrders";

interface OrderCardProps {
  order: Order;
}

function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span className="badge badge-sm badge-soft badge-info gap-1.5">
      <span className="size-1.5 rounded-full bg-sky-500" />
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

function OrderProduct({ item }: { item: OrderItem }) {
  return (
    <div className="flex gap-4">
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={item.coverImage}
          alt={item.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg font-bold text-slate-800">
          {item.title}
        </h3>
        <p className="text-sm text-sky-600">{item.author}</p>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span>Qty: {item.quantity}</span>
          <span className="font-semibold text-slate-800">
            {item.currency}
            {item.price}
          </span>
          <span className="badge badge-sm badge-soft badge-secondary gap-1">
            <span>{item.seller.icon}</span>
            {item.seller.name}
          </span>
        </div>
      </div>
    </div>
  );
}

function DeliveryAddress({ address }: { address: string }) {
  return (
    <div className="rounded-xl bg-sky-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
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
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Delivery Address
      </div>
      <p className="mt-2 text-sm text-slate-600">{address}</p>
    </div>
  );
}

function DeliveryAgentCard({ agent }: { agent: DeliveryAgent }) {
  return (
    <div className="rounded-xl bg-violet-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
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
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
        Delivery Agent
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="avatar placeholder shrink-0">
          <div
            className={`flex size-11 items-center justify-center rounded-full ${agent.avatarColor}`}
          >
            <span className="text-sm font-semibold">{agent.initials}</span>
          </div>
        </div>

        <div>
          <p className="font-semibold text-slate-800">{agent.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-amber-500">
              ★ {agent.rating}
            </span>
            <span className="flex items-center gap-1 text-sky-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {agent.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <article className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="card-body gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-sm font-semibold text-sky-600">
              {order.orderNumber}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{order.placedAt}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <OrderProduct item={order.item} />

        <OrderStepper currentStep={order.currentStep} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DeliveryAddress address={order.deliveryAddress} />
          <DeliveryAgentCard agent={order.agent} />
        </div>
      </div>
    </article>
  );
}
