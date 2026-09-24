import connectDB from "@/dbConfig/dbConfig";
import { Order } from "@/Model/Orders";
import type { MyOrdersData, OrderStatus } from "@/types/myOrders";

type StoredOrder = {
  _id: { toString(): string };
  orderNumber: string;
  bookTitle: string;
  author: string;
  coverImage?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  address: string;
  city: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt?: Date;
};

const paymentIcon: Record<string, string> = {
  bkash: "💗",
  rocket: "🚀",
};

export async function getMyOrders(userId: string): Promise<MyOrdersData> {
  await connectDB();
  const records = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .lean<StoredOrder[]>();

  const orders = records.map((order) => {
    const method = order.paymentMethod.toLowerCase();
    const placed = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "today";

    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      placedAt: `Placed ${placed}`,
      status: order.status,
      currentStep: order.status,
      item: {
        title: order.bookTitle,
        author: order.author,
        coverImage: order.coverImage || "/svg/book.svg",
        quantity: order.quantity,
        price: order.unitPrice * order.quantity,
        currency: order.currency,
        seller: {
          name: order.paymentMethod,
          icon: paymentIcon[method] ?? "📚",
        },
      },
      deliveryAddress: `${order.address}, ${order.city}`,
      agent: {
        name: "Library desk",
        initials: "LD",
        avatarColor: "bg-sky-100 text-sky-700",
        rating: 5,
        phone: "01700000000",
      },
    };
  });

  const count = (status: OrderStatus | "all") =>
    status === "all"
      ? orders.length
      : orders.filter((order) => order.status === status).length;

  return {
    title: "My Orders",
    subtitle: "Purchases you placed from the catalog",
    filters: [
      { id: "all", label: "All Orders", status: "all", count: count("all") },
      { id: "processing", label: "Processing", status: "processing", count: count("processing") },
      { id: "in-transit", label: "In Transit", status: "in-transit", count: count("in-transit") },
      { id: "delivered", label: "Delivered", status: "delivered", count: count("delivered") },
    ],
    orders,
  };
}
