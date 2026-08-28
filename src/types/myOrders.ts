export type OrderStatus = "processing" | "in-transit" | "delivered";

export type OrderStep = "order-placed" | "processing" | "in-transit" | "delivered";

export type OrderFilter = {
  id: string;
  label: string;
  status: OrderStatus | "all";
  count: number;
};

export type DeliveryAgent = {
  name: string;
  initials: string;
  avatarColor: string;
  rating: number;
  phone: string;
};

export type OrderItem = {
  title: string;
  author: string;
  coverImage: string;
  quantity: number;
  price: number;
  currency: string;
  seller: {
    name: string;
    icon: string;
  };
};

export type Order = {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  currentStep: OrderStep;
  item: OrderItem;
  deliveryAddress: string;
  agent: DeliveryAgent;
};

export type MyOrdersData = {
  title: string;
  subtitle: string;
  filters: OrderFilter[];
  orders: Order[];
};

export const ORDER_STEPS: { id: OrderStep; label: string }[] = [
  { id: "order-placed", label: "Order Placed" },
  { id: "processing", label: "Processing" },
  { id: "in-transit", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "Processing",
  "in-transit": "In Transit",
  delivered: "Delivered",
};
