"use client";

import { useState } from "react";
import CheckoutHeader from "../CheckoutHeader/CheckoutHeader";
import CheckoutStepper from "../CheckoutStepper/CheckoutStepper";
import ConfirmPaymentForm from "../ConfirmPaymentForm/ConfirmPaymentForm";
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
  ConfirmPaymentFormData,
  DeliveryFormData,
  PaymentMethodFormData,
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

  const [deliveryForm, setDeliveryForm] = useState<DeliveryFormData>({
    fullName: "",
    phone: "",
    address: "",
    city: checkout.delivery.defaultCity,
    quantity: 1,
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodFormData>({
    methodId: checkout.paymentMethods[0]?.id ?? "bkash",
  });

  const [confirmForm, setConfirmForm] = useState<ConfirmPaymentFormData>({
    transactionId: "",
    paymentPhone: "",
  });
  const [orderError, setOrderError] = useState("");

  const orderQuantity =
    step === "details" ? summaryQuantity : deliveryForm.quantity;

  const selectedMethod = checkout.paymentMethods.find(
    (method) => method.id === paymentMethod.methodId,
  );

  const amount = calculateCheckoutTotal(
    checkout.book,
    checkout.pricing,
    deliveryForm.quantity,
  );

  function handleDeliverySubmit(data: DeliveryFormData) {
    setDeliveryForm(data);
    setSummaryQuantity(data.quantity);
    setStep("payment");
  }

  function handlePaymentConfirm(data: PaymentMethodFormData) {
    setPaymentMethod(data);
    setOrderError("");
    setStep("confirm");
  }

  async function handlePurchaseConfirm(data: ConfirmPaymentFormData) {
    setConfirmForm(data);
    setOrderError("");
    setSubmitting(true);

    const methodName = selectedMethod?.name ?? paymentMethod.methodId;

    try {
      const response = await fetch("/api/users/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: checkout.userId,
          bookId: String(checkout.book.id),
          quantity: deliveryForm.quantity,
          fullName: deliveryForm.fullName,
          phone: deliveryForm.phone,
          address: deliveryForm.address,
          city: deliveryForm.city,
          methodId: paymentMethod.methodId,
          paymentMethodName: methodName,
          transactionId: data.transactionId,
          paymentPhone: data.paymentPhone,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setOrderError(payload.message || "Could not place the order");
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
        paymentStatus: payload.data?.paymentStatus || "pending",
        emailSent: Boolean(payload.data?.emailSent),
        verificationEmail:
          payload.data?.verificationEmail || checkout.payer.email || "",
      });
    } finally {
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
                defaultValues={paymentMethod}
                onBack={() => setStep("details")}
                onSubmit={handlePaymentConfirm}
              />
            )}

            {step === "confirm" && (
              <ConfirmPaymentForm
                bookTitle={checkout.book.title}
                amount={amount}
                currency={checkout.pricing.currency}
                selectedMethod={selectedMethod}
                defaultValues={confirmForm}
                submitting={submitting}
                error={orderError}
                onBack={() => setStep("payment")}
                onSubmit={(data) => {
                  void handlePurchaseConfirm(data);
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
