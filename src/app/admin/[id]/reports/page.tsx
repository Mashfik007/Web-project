import ReportsPage from "@/Components/AdminOps/ReportsPage/ReportsPage";
import {
  getAdminReports,
  reportPeriod,
  reportTab,
  resolveReportRange,
} from "@/data/getAdminReports";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    period?: string;
    tab?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const period = reportPeriod(query.period);
  const tab = reportTab(query.tab);

  if (query.period !== period || query.tab !== tab) {
    redirect(`/admin/${id}/reports?period=${period}&tab=${tab}`);
  }

  const filters = { period, tab, from: query.from, to: query.to };
  const range = resolveReportRange(filters);
  const report = await getAdminReports(id, filters);

  return (
    <ReportsPage
      adminId={id}
      period={period}
      tab={tab}
      from={range.start}
      to={range.end}
      report={report}
    />
  );
}
