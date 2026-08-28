import BorrowRequestsHeader from "../BorrowRequestsHeader/BorrowRequestsHeader";
import RequestList from "../RequestList/RequestList";
import type { BorrowRequestsData } from "@/types/borrowRequests";

interface BorrowRequestsPageProps {
  borrowRequests: BorrowRequestsData;
}

export default function BorrowRequestsPage({
  borrowRequests,
}: BorrowRequestsPageProps) {
  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6">
        <BorrowRequestsHeader
          title={borrowRequests.title}
          subtitle={borrowRequests.subtitle}
        />

        <RequestList
          filters={borrowRequests.filters}
          requests={borrowRequests.requests}
        />
      </div>
    </main>
  );
}
