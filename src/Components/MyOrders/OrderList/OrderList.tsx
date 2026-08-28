"use client";

import { useMemo, useState } from "react";
import OrderCard from "../OrderCard/OrderCard";
import OrderFilterTabs from "../OrderFilterTabs/OrderFilterTabs";
import type { Order, OrderFilter, OrderStatus } from "@/types/myOrders";

interface OrderListProps {
  filters: OrderFilter[];
  orders: Order[];
}

export default function OrderList({ filters, orders }: OrderListProps) {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">(
    "in-transit",
  );

  const visibleOrders = useMemo(
    () =>
      activeStatus === "all"
        ? orders
        : orders.filter((order) => order.status === activeStatus),
    [activeStatus, orders],
  );

  return (
    <div className="space-y-5">
      <OrderFilterTabs
        filters={filters}
        activeStatus={activeStatus}
        onChange={setActiveStatus}
      />

      <div className="space-y-4">
        {visibleOrders.length === 0 ? (
          <div className="alert rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-sm text-slate-500">
              No orders in this category.
            </span>
          </div>
        ) : (
          visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}
