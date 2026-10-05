import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { DigitalResource } from "@/Model/DigitalResources";
import { DownloadEvent } from "@/Model/DownloadEvents";
import { Fine } from "@/Model/Fines";
import { LibraryUser } from "@/Model/LibraryUsers";
import { Order } from "@/Model/Orders";
import { ReturnRecord } from "@/Model/Returns";
import type {
  AdminReport,
  AdminReportPeriod,
  AdminReportPoint,
  AdminReportRow,
  AdminReportTab,
} from "@/types/adminOps";

export type ReportFilters = {
  period: AdminReportPeriod;
  tab: AdminReportTab;
  from?: string;
  to?: string;
};

type DatedCount = {
  date: string;
  amount: number;
};

const periods = new Set<AdminReportPeriod>(["week", "month", "year", "custom"]);
const tabs = new Set<AdminReportTab>([
  "borrows",
  "users",
  "fines",
  "inventory",
  "sales",
  "downloads",
]);

export function reportPeriod(value: string | undefined): AdminReportPeriod {
  return periods.has(value as AdminReportPeriod)
    ? (value as AdminReportPeriod)
    : "month";
}

export function reportTab(value: string | undefined): AdminReportTab {
  return tabs.has(value as AdminReportTab) ? (value as AdminReportTab) : "borrows";
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function shiftDay(day: string, amount: number) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function isDay(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function dayCount(start: string, end: string) {
  const from = new Date(`${start}T00:00:00.000Z`).getTime();
  const to = new Date(`${end}T00:00:00.000Z`).getTime();
  return Math.round((to - from) / 86400000);
}

export function resolveReportRange(filters: ReportFilters) {
  const today = todayKey();

  if (filters.period === "week") {
    return {
      start: shiftDay(today, -6),
      end: today,
      unit: "day" as const,
      label: "This Week",
    };
  }

  if (filters.period === "year") {
    return {
      start: `${today.slice(0, 4)}-01-01`,
      end: today,
      unit: "month" as const,
      label: "This Year",
    };
  }

  if (filters.period === "custom") {
    const start = isDay(filters.from) ? filters.from : shiftDay(today, -29);
    const end = isDay(filters.to) ? filters.to : today;
    const [from, to] = start <= end ? [start, end] : [end, start];
    return {
      start: from,
      end: to,
      unit: dayCount(from, to) > 62 ? ("month" as const) : ("day" as const),
      label: `${from} to ${to}`,
    };
  }

  return {
    start: `${today.slice(0, 8)}01`,
    end: today,
    unit: "day" as const,
    label: "This Month",
  };
}

function bucketPoints(start: string, end: string, unit: "day" | "month") {
  const points: { key: string; label: string }[] = [];

  if (unit === "month") {
    let year = Number(start.slice(0, 4));
    let month = Number(start.slice(5, 7)) - 1;
    const endYear = Number(end.slice(0, 4));
    const endMonth = Number(end.slice(5, 7)) - 1;

    while (year < endYear || (year === endYear && month <= endMonth)) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}`;
      const label = new Date(Date.UTC(year, month, 1)).toLocaleString("en", {
        month: "short",
        timeZone: "UTC",
      });
      points.push({ key, label });
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
    }

    return points;
  }

  let cursor = start;
  while (cursor <= end) {
    const label = new Date(`${cursor}T00:00:00.000Z`).toLocaleString("en", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
    points.push({ key: cursor, label });
    cursor = shiftDay(cursor, 1);
  }

  return points;
}

function fillTrend(
  start: string,
  end: string,
  unit: "day" | "month",
  rows: DatedCount[],
): AdminReportPoint[] {
  const points = bucketPoints(start, end, unit);
  const totals = new Map(points.map((point) => [point.key, 0]));

  for (const row of rows) {
    const key = unit === "month" ? row.date.slice(0, 7) : row.date;
    if (!totals.has(key)) continue;
    totals.set(key, (totals.get(key) ?? 0) + row.amount);
  }

  return points.map((point) => ({
    month: point.label,
    borrows: totals.get(point.key) ?? 0,
  }));
}

function dateKey(value: Date | string | undefined) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function inRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

function topCounts(rows: { key: string }[], limit = 8) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.key, (counts.get(row.key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit);
}

export function reportLines(report: AdminReport, subtitle: string) {
  const lines = [
    "Reports & Analytics",
    subtitle,
    "",
    report.chartTitle,
    "Period,Value",
    ...report.trends.map((point) => `${point.month},${point.borrows}`),
    "",
    report.tableTitle,
    report.columns.join(","),
    ...report.rows.map((row) =>
      [row.primary, row.secondary, row.value, row.extra]
        .map((cell) => `"${cell.replaceAll('"', '""')}"`)
        .join(","),
    ),
  ];

  if (report.rows.length === 0) lines.push("No records,,,");
  return lines;
}

export async function getAdminReports(
  _adminId: string,
  filters: ReportFilters,
): Promise<AdminReport> {
  await connectDB();
  const range = resolveReportRange(filters);
  const startDate = new Date(`${range.start}T00:00:00.000Z`);
  const endDate = new Date(`${range.end}T23:59:59.999Z`);

  if (filters.tab === "users") {
    const [users, returns] = await Promise.all([
      LibraryUser.find({ createdAt: { $gte: startDate, $lte: endDate } })
        .select("createdAt")
        .lean<{ createdAt?: Date }[]>(),
      ReturnRecord.find({ issueDate: { $gte: range.start, $lte: range.end } })
        .select("member")
        .lean<{ member: string }[]>(),
    ]);
    const ranked = topCounts(returns.map((item) => ({ key: item.member })));
    const profiles = await LibraryUser.find({
      name: { $in: ranked.map(([name]) => name) },
    })
      .select("name role status")
      .lean<{ name: string; role: string; status: string }[]>();
    const profileByName = new Map(profiles.map((user) => [user.name, user]));

    return {
      trends: fillTrend(
        range.start,
        range.end,
        range.unit,
        users
          .map((user) => dateKey(user.createdAt))
          .filter((date) => inRange(date, range.start, range.end))
          .map((date) => ({ date, amount: 1 })),
      ),
      chartTitle: "New Members",
      seriesName: "Members",
      tableTitle: "Most Active Members",
      columns: ["Member", "Role", "Borrows", "Status"],
      rows: ranked.map(([name, borrows]) => {
        const profile = profileByName.get(name);
        return {
          primary: name,
          secondary: profile?.role ?? "Member",
          value: String(borrows),
          extra: profile?.status ?? "—",
        };
      }),
    };
  }

  if (filters.tab === "fines") {
    const fines = await Fine.find({
      date: { $gte: range.start, $lte: range.end },
    })
      .select("member book amount date status")
      .lean<
        { member: string; book: string; amount: number; date: string; status: string }[]
      >();
    const rows: AdminReportRow[] = [...fines]
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 8)
      .map((fine) => ({
        primary: fine.member,
        secondary: fine.book,
        value: `৳${fine.amount}`,
        extra: fine.status,
      }));

    return {
      trends: fillTrend(
        range.start,
        range.end,
        range.unit,
        fines.map((fine) => ({ date: fine.date, amount: fine.amount })),
      ),
      chartTitle: "Fine Amounts",
      seriesName: "Amount",
      tableTitle: "Largest Fines",
      columns: ["Member", "Book", "Amount", "Status"],
      rows,
    };
  }

  if (filters.tab === "inventory") {
    const [added, stock] = await Promise.all([
      Book.find({ createdAt: { $gte: startDate, $lte: endDate } })
        .select("createdAt")
        .lean<{ createdAt?: Date }[]>(),
      Book.find()
        .select(
          "title metadata.category availability.current availability.total",
        )
        .sort({ "availability.current": 1, title: 1 })
        .limit(8)
        .lean<
          {
            title: string;
            metadata?: { category?: string };
            availability?: { current?: number; total?: number };
          }[]
        >(),
    ]);

    return {
      trends: fillTrend(
        range.start,
        range.end,
        range.unit,
        added.map((book) => ({ date: dateKey(book.createdAt), amount: 1 })),
      ),
      chartTitle: "Books Added",
      seriesName: "Books",
      tableTitle: "Lowest Stock",
      columns: ["Book", "Category", "On Shelf", "Total"],
      rows: stock.map((book) => ({
        primary: book.title,
        secondary:
          book.metadata?.category || "—",
        value: String(book.availability?.current ?? 0),
        extra: String(book.availability?.total ?? 0),
      })),
    };
  }

  if (filters.tab === "sales") {
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .select("bookTitle fullName quantity total currency status createdAt")
      .lean<
        {
          bookTitle: string;
          fullName: string;
          quantity: number;
          total: number;
          currency?: string;
          status: string;
          createdAt?: Date;
        }[]
      >();

    const byBook = new Map<
      string,
      { copies: number; revenue: number; currency: string }
    >();
    for (const order of orders) {
      const current = byBook.get(order.bookTitle) ?? {
        copies: 0,
        revenue: 0,
        currency: order.currency || "৳",
      };
      current.copies += order.quantity;
      current.revenue += order.total;
      byBook.set(order.bookTitle, current);
    }

    const ranked = [...byBook.entries()]
      .sort((left, right) => right[1].revenue - left[1].revenue)
      .slice(0, 8);

    return {
      trends: fillTrend(
        range.start,
        range.end,
        range.unit,
        orders.map((order) => ({
          date: dateKey(order.createdAt),
          amount: order.total,
        })),
      ),
      chartTitle: "Purchase Revenue",
      seriesName: "Revenue",
      tableTitle: "Top Purchased Books",
      columns: ["Book", "Buyer focus", "Copies sold", "Revenue"],
      rows: ranked.map(([title, stats]) => ({
        primary: title,
        secondary: `${orders.filter((order) => order.bookTitle === title).length} orders`,
        value: String(stats.copies),
        extra: `${stats.currency}${stats.revenue.toLocaleString()}`,
      })),
    };
  }

  if (filters.tab === "downloads") {
    const [events, topResources] = await Promise.all([
      DownloadEvent.find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
        .select("title format category createdAt")
        .lean<
          {
            title: string;
            format: string;
            category?: string;
            createdAt?: Date;
          }[]
        >(),
      DigitalResource.find()
        .select("title author format category downloads")
        .sort({ downloads: -1, title: 1 })
        .limit(8)
        .lean<
          {
            title: string;
            author?: string;
            format: string;
            category?: string;
            downloads?: number;
          }[]
        >(),
    ]);

    return {
      trends: fillTrend(
        range.start,
        range.end,
        range.unit,
        events.map((event) => ({
          date: dateKey(event.createdAt),
          amount: 1,
        })),
      ),
      chartTitle: "PDF / Digital Downloads",
      seriesName: "Downloads",
      tableTitle: "Most Downloaded Resources",
      columns: ["Title", "Format", "Downloads", "Category"],
      rows: topResources.map((resource) => ({
        primary: resource.title,
        secondary: resource.format,
        value: String(resource.downloads ?? 0),
        extra: resource.category || "—",
      })),
    };
  }

  const returns = await ReturnRecord.find({
    issueDate: { $gte: range.start, $lte: range.end },
  })
    .select("book issueDate")
    .lean<{ book: string; issueDate: string }[]>();
  const ranked = topCounts(returns.map((item) => ({ key: item.book })));
  const books = await Book.find({ title: { $in: ranked.map(([title]) => title) } })
    .select("title rating.score metadata.category")
    .lean<
      {
        title: string;
        rating?: { score?: number };
        metadata?: { category?: string };
      }[]
    >();
  const bookByTitle = new Map(books.map((book) => [book.title, book]));

  return {
    trends: fillTrend(
      range.start,
      range.end,
      range.unit,
      returns.map((item) => ({ date: item.issueDate, amount: 1 })),
    ),
    chartTitle: "Borrow Trends",
    seriesName: "Borrows",
    tableTitle: "Top Borrowed Books",
    columns: ["Book", "Category", "Borrows", "Rating"],
    rows: ranked.map(([title, borrows]) => {
      const book = bookByTitle.get(title);
      const rating = book?.rating?.score;
      return {
        primary: title,
        secondary:
          book?.metadata?.category || "—",
        value: String(borrows),
        extra: rating === undefined ? "—" : `★ ${rating}`,
      };
    }),
  };
}
