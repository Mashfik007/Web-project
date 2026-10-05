import OrdersPage from "@/Components/AdminOps/OrdersPage/OrdersPage";
import { getAdminOrders } from "@/data/getAdminOrders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const { summary, orders } = await getAdminOrders(id);

  return <OrdersPage summary={summary} orders={orders} />;
}
