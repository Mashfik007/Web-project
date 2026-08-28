export type CheckoutStep = "details" | "payment" | "confirm";

export type CheckoutBook = {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  unitPrice: number;
  currency: string;
};

export type CheckoutPricing = {
  deliveryFee: number;
  currency: string;
};

export type CheckoutDelivery = {
  cities: string[];
  defaultCity: string;
  estimatedDelivery: string;
};

export type PaymentMethod = {
  id: "bkash" | "rocket";
  name: string;
  logoSrc: string;
  accentClass: string;
  borderActiveClass: string;
  panelClass: string;
  copyButtonClass: string;
  merchantNumber: string;
  instructions: string[];
};

export type CheckoutData = {
  title: string;
  subtitle: string;
  book: CheckoutBook;
  pricing: CheckoutPricing;
  delivery: CheckoutDelivery;
  paymentMethods: PaymentMethod[];
  backHref: string;
  ordersHref: string;
  browseHref: string;
};

export type DeliveryFormData = import("@/Shchema/checkout").DeliveryFormValues;
export type PaymentFormData = import("@/Shchema/checkout").PaymentFormValues;

export type PlacedOrder = {
  orderId: string;
  bookTitle: string;
  totalPaid: number;
  currency: string;
  paymentMethod: string;
};

export const CHECKOUT_STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "payment", label: "Payment" },
  { id: "confirm", label: "Confirm" },
];
