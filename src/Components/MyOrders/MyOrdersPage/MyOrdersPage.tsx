import MyOrdersHeader from "../MyOrdersHeader/MyOrdersHeader";
import OrderList from "../OrderList/OrderList";
import type { MyOrdersData } from "@/types/myOrders";

interface MyOrdersPageProps {
  myOrders: MyOrdersData;
}

export default function MyOrdersPage({ myOrders }: MyOrdersPageProps) {
  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6">
        <MyOrdersHeader title={myOrders.title} subtitle={myOrders.subtitle} />

        <OrderList filters={myOrders.filters} orders={myOrders.orders} />
      </div>
    </main>
  );
}
