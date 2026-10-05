import connectDB from "@/dbConfig/dbConfig";
import { Order } from "@/Model/Orders";
import type {
  AdminOrder,
  AdminOrderStatus,
  AdminOrderSummary,
} from "@/types/adminOps";

type StoredOrder = {
  _id: { toString(): string };
  orderNumber: string;
  fullName: string;
  bookTitle: string;
  quantity: number;
  total: number;
  currency?: string;
  paymentMethod: string;
  paymentStatus?: string;
  status: AdminOrderStatus;
  createdAt?: Date;
};

const avatarClasses = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || name.slice(0, 2).toUpperCase() || "U";
}

function avatarClassFrom(name: string) {
  const code = name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return avatarClasses[code % avatarClasses.length];
}

export async function getAdminOrders(_adminId: string): Promise<{
  summary: AdminOrderSummary;
  orders: AdminOrder[];
}> {
  await connectDB();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const records = await Order.find()
    .sort({ createdAt: -1 })
    .lean<StoredOrder[]>();

  const summary: AdminOrderSummary = {
    totalOrders: records.length,
    revenue: 0,
    thisMonth: 0,
    processing: 0,
  };

  const orders = records.map((record) => {
    summary.revenue += record.total;
    if (record.status === "processing") summary.processing += 1;
    if (record.createdAt && new Date(record.createdAt) >= monthStart) {
      summary.thisMonth += record.total;
    }

    return {
      id: record._id.toString(),
      orderNumber: record.orderNumber,
      member: record.fullName,
      initials: initialsFrom(record.fullName),
      avatarClass: avatarClassFrom(record.fullName),
      book: record.bookTitle,
      quantity: record.quantity,
      total: record.total,
      currency: record.currency || "৳",
      paymentMethod: record.paymentMethod,
      paymentStatus: record.paymentStatus || "pending",
      status: record.status,
      placedAt: record.createdAt
        ? new Date(record.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
    };
  });

  return { summary, orders };
}
