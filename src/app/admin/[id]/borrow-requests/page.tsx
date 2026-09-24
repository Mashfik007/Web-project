import BorrowRequestsPage from "@/Components/AdminOps/BorrowRequestsPage/BorrowRequestsPage";
import { getAdminBorrowRequests } from "@/data/getAdminBorrowRequests";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const requests = await getAdminBorrowRequests(id);

  return <BorrowRequestsPage requests={requests} />;
}
