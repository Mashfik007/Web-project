import {
  getAdminReports,
  reportLines,
  reportPeriod,
  reportTab,
  resolveReportRange,
} from "@/data/getAdminReports";
import { reportCsv, reportPdf } from "@/data/reportFile";
import ApiError from "@/Utils/Api_error";

const tabNames = {
  borrows: "Borrow activity",
  users: "User stats",
  fines: "Fine report",
  inventory: "Inventory",
  sales: "Purchases",
  downloads: "Downloads",
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const period = reportPeriod(url.searchParams.get("period") ?? undefined);
    const tab = reportTab(url.searchParams.get("tab") ?? undefined);
    const format = url.searchParams.get("format");
    const from = url.searchParams.get("from") ?? undefined;
    const to = url.searchParams.get("to") ?? undefined;

    if (format !== "csv" && format !== "pdf") {
      return new Response(JSON.stringify(new ApiError(400, "Choose CSV or PDF")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filters = { period, tab, from, to };
    const report = await getAdminReports("", filters);
    const range = resolveReportRange(filters);
    const lines = reportLines(report, `${tabNames[tab]} · ${range.label}`);
    const body = format === "csv" ? reportCsv(lines) : reportPdf(lines);
    const filename = `${tab}-${period}.${format}`;
    const message =
      format === "csv"
        ? `${tabNames[tab]} was downloaded as CSV.`
        : `${tabNames[tab]} PDF is ready to share.`;

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": format === "csv" ? "text/csv; charset=utf-8" : "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Report-Message": message,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
