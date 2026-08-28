import BorrowRequestsPage from "@/Components/BorrowRequests/BorrowRequestsPage/BorrowRequestsPage";
import { getBorrowRequestsData } from "@/Components/BorrowRequests/data/fakeBorrowRequestsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const borrowRequests = await getBorrowRequestsData(id);

  return <BorrowRequestsPage borrowRequests={borrowRequests} />;
}
