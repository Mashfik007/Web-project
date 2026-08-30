import mapPinIcon from "@svg/map-pin.svg";
import phoneIcon from "@svg/phone.svg";
import truckIcon from "@svg/truck.svg";
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
        <Image
          src={mapPinIcon}
          alt="Location"
          width={16}
          height={16}
          className="size-4"
        />
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
        <Image
          src={truckIcon}
          alt="Delivery"
          width={16}
          height={16}
          className="size-4"
        />
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
              <Image
                src={phoneIcon}
                alt="Phone"
                width={14}
                height={14}
                className="size-3.5"
              />
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
