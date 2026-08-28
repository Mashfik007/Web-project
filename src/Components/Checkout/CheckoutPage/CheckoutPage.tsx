"use client";

import { useState } from "react";
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

  function handleDeliverySubmit(data: DeliveryFormData) {
    setDeliveryForm(data);
    setSummaryQuantity(data.quantity);
    setStep("payment");
  }

  function handlePaymentSubmit(data: PaymentFormData) {
    setPaymentForm(data);

    const paymentMethod =
      checkout.paymentMethods.find((method) => method.id === data.methodId)
        ?.name ?? data.methodId;

    setPlacedOrder({
      orderId: generateOrderId(),
      bookTitle: checkout.book.title,
      totalPaid: calculateCheckoutTotal(
        checkout.book,
        checkout.pricing,
        deliveryForm.quantity,
      ),
      currency: checkout.pricing.currency,
      paymentMethod: paymentMethod.toLowerCase(),
    });
    setStep("confirm");
  }

  if (step === "confirm" && placedOrder) {
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
                defaultValues={paymentForm}
                onBack={() => setStep("details")}
                onSubmit={handlePaymentSubmit}
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
