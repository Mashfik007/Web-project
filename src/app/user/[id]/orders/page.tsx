import MyOrdersPage from "@/Components/MyOrders/MyOrdersPage/MyOrdersPage";
import { getMyOrdersData } from "@/Components/MyOrders/data/fakeMyOrdersData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const myOrders = await getMyOrdersData(id);

  return <MyOrdersPage myOrders={myOrders} />;
}
