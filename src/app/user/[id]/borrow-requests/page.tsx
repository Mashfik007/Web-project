import BorrowRequestsPage from "@/Components/BorrowRequests/BorrowRequestsPage/BorrowRequestsPage";
import { getUserBorrowRequests } from "@/data/getUserBorrowRequests";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const borrowRequests = await getUserBorrowRequests(id);

  return <BorrowRequestsPage borrowRequests={borrowRequests} />;
}
