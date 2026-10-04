"use client";

import { useRef, useState } from "react";
import CheckoutHeader from "../CheckoutHeader/CheckoutHeader";
import CheckoutStepper from "../CheckoutStepper/CheckoutStepper";
import DeliveryForm from "../DeliveryForm/DeliveryForm";
import EstimatedDelivery from "../EstimatedDelivery/EstimatedDelivery";
import OrderSuccess, { generateOrderId } from "../OrderSuccess/OrderSuccess";
import OrderSummary, {
  calculateCheckoutTotal,
} from "../OrderSummary/OrderSummary";
import PaymentForm from "../PaymentForm/PaymentForm";
import type {
  CheckoutData,
  CheckoutStep,
  DeliveryFormData,
  PaymentFormData,
  PlacedOrder,
} from "@/types/checkout";

interface CheckoutPageProps {
  checkout: CheckoutData;
}

export default function CheckoutPage({ checkout }: CheckoutPageProps) {
  const [step, setStep] = useState<CheckoutStep>("details");
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [summaryQuantity, setSummaryQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const submittingRef = useRef(false);

  const [deliveryForm, setDeliveryForm] = useState<DeliveryFormData>({
    fullName: "",
    phone: "",
    address: "",
    city: checkout.delivery.defaultCity,
    quantity: 1,
  });

  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    methodId: checkout.paymentMethods[0]?.id ?? "bkash",
    transactionId: "",
    paymentPhone: "",
  });

  const orderQuantity =
    step === "details" ? summaryQuantity : deliveryForm.quantity;

  const selectedMethod = checkout.paymentMethods.find(
    (method) => method.id === paymentForm.methodId,
  );

  const amount = calculateCheckoutTotal(
    checkout.book,
    checkout.pricing,
    deliveryForm.quantity,
  );

  function handleDeliverySubmit(data: DeliveryFormData) {
    setDeliveryForm(data);
    setSummaryQuantity(data.quantity);
    setOrderError("");
    setStep("payment");
  }

  async function handlePaidSubmit(data: PaymentFormData) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setPaymentForm(data);
    setOrderError("");
    setSubmitting(true);

    const methodName = selectedMethod?.name ?? data.methodId;

    try {
      const response = await fetch("/api/users/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: checkout.userId,
          bookId: String(checkout.book.id),
          quantity: deliveryForm.quantity,
          fullName: deliveryForm.fullName,
          phone: deliveryForm.phone,
          address: deliveryForm.address,
          city: deliveryForm.city,
          methodId: data.methodId,
          paymentMethodName: methodName,
          transactionId: data.transactionId,
          paymentPhone: data.paymentPhone,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setOrderError(
          response.status === 401
            ? "Your session expired. Log in again, then try again."
            : payload.message || "Could not save the order",
        );
        return;
      }

      setPlacedOrder({
        orderId: payload.data?.orderNumber || generateOrderId(),
        bookTitle: checkout.book.title,
        totalPaid: payload.data?.total ?? amount,
        currency: payload.data?.currency ?? checkout.pricing.currency,
        paymentMethod: methodName.toLowerCase(),
        transactionId:
          payload.data?.transactionId || data.transactionId.toUpperCase(),
        paymentStatus: payload.data?.paymentStatus || "verified",
      });
    } catch (error) {
      setOrderError(
        error instanceof Error ? error.message : "Could not save the order",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  if (placedOrder) {
    return (
      <main className="min-h-screen w-full bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-16">
          <OrderSuccess
            order={placedOrder}
            ordersHref={checkout.ordersHref}
            browseHref={checkout.browseHref}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6">
        <CheckoutHeader
          title={checkout.title}
          subtitle={checkout.subtitle}
          backHref={checkout.backHref}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <CheckoutStepper currentStep={step} />

            {step === "details" && (
              <DeliveryForm
                delivery={checkout.delivery}
                defaultValues={deliveryForm}
                onQuantityChange={setSummaryQuantity}
                onSubmit={handleDeliverySubmit}
              />
            )}

            {step === "payment" && (
              <PaymentForm
                paymentMethods={checkout.paymentMethods}
                payer={checkout.payer}
                bookTitle={checkout.book.title}
                amount={amount}
                currency={checkout.pricing.currency}
                defaultValues={paymentForm}
                submitting={submitting}
                error={orderError}
                onBack={() => setStep("details")}
                onSubmit={(data) => {
                  void handlePaidSubmit(data);
                }}
              />
            )}
          </div>

          <aside className="space-y-4">
            <OrderSummary
              book={checkout.book}
              pricing={checkout.pricing}
              quantity={orderQuantity}
            />
            <EstimatedDelivery message={checkout.delivery.estimatedDelivery} />
          </aside>
        </div>
      </div>
    </main>
  );
}
