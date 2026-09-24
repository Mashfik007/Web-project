import MyOrdersPage from "@/Components/MyOrders/MyOrdersPage/MyOrdersPage";
import { getMyOrders } from "@/data/getMyOrders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const myOrders = await getMyOrders(id);

  return <MyOrdersPage myOrders={myOrders} />;
}
