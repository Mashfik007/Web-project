import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminTable from "@/Components/AdminCatalog/AdminTable/AdminTable";
import StatusBadge from "@/Components/AdminCatalog/StatusBadge/StatusBadge";
import AdminCard from "@/Components/AdminOps/AdminCard/AdminCard";
import MemberCell from "@/Components/AdminOps/MemberCell/MemberCell";
import type { AdminOrder, AdminOrderSummary } from "@/types/adminOps";

interface OrdersPageProps {
  summary: AdminOrderSummary;
  orders: AdminOrder[];
}

const cards = [
  {
    key: "totalOrders",
    label: "Total Orders",
    format: (value: number) => value.toLocaleString(),
    color: "text-sky-500 bg-sky-50",
    icon: "#",
  },
  {
    key: "revenue",
    label: "Total Revenue",
    format: (value: number) => `৳${value.toLocaleString()}`,
    color: "text-emerald-500 bg-emerald-50",
    icon: "৳",
  },
  {
    key: "thisMonth",
    label: "This Month",
    format: (value: number) => `৳${value.toLocaleString()}`,
    color: "text-amber-500 bg-amber-50",
    icon: "↗",
  },
  {
    key: "processing",
    label: "Processing",
    format: (value: number) => value.toLocaleString(),
    color: "text-violet-500 bg-violet-50",
    icon: "◷",
  },
] as const;

const statusTone: Record<
  AdminOrder["status"],
  "green" | "sky" | "orange"
> = {
  delivered: "green",
  "in-transit": "sky",
  processing: "orange",
};

export default function OrdersPage({ summary, orders }: OrdersPageProps) {
  return (
    <AdminPageShell
      title="Purchases"
      subtitle="Books bought by members"
      framed={false}
    >
      <div className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.key} className="card bg-base-100 p-4 shadow-sm">
            <span
              className={`flex size-9 items-center justify-center rounded-lg text-sm font-bold ${card.color}`}
            >
              {card.icon}
            </span>
            <p className="mt-3 text-xl font-bold text-slate-800">
              {card.format(summary[card.key])}
            </p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </article>
        ))}
      </div>

      <AdminCard>
        <AdminTable
          columns={[
            "Order",
            "Buyer",
            "Book",
            "Qty",
            "Total",
            "Payment",
            "Status",
            "Placed",
          ]}
          from={orders.length === 0 ? 0 : 1}
          to={orders.length}
          total={orders.length}
        >
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-sm text-slate-400"
              >
                No purchases yet.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="text-sm">
                <td className="px-4 py-3 font-semibold text-slate-700">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3">
                  <MemberCell
                    name={order.member}
                    initials={order.initials}
                    avatarClass={order.avatarClass}
                  />
                </td>
                <td className="px-4 py-3 text-slate-700">{order.book}</td>
                <td className="px-4 py-3 text-slate-600">{order.quantity}</td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {order.currency}
                  {order.total.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {order.paymentMethod}
                  <span className="mt-0.5 block text-xs capitalize text-slate-400">
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={order.status}
                    tone={statusTone[order.status]}
                  />
                </td>
                <td className="px-4 py-3 text-slate-500">{order.placedAt}</td>
              </tr>
            ))
          )}
        </AdminTable>
      </AdminCard>
    </AdminPageShell>
  );
}
