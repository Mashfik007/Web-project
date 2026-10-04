"use client";

import {
  paymentMethodSchema,
  type PaymentMethodValues,
} from "@/Shchema/checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { SubmitHandler, useForm } from "react-hook-form";
import type {
  CheckoutPayer,
  PaymentMethod,
  PaymentMethodFormData,
} from "@/types/checkout";

interface PaymentFormProps {
  paymentMethods: PaymentMethod[];
  payer: CheckoutPayer;
  bookTitle: string;
  amount: number;
  currency: string;
  defaultValues?: PaymentMethodFormData;
  onBack: () => void;
  onSubmit: (data: PaymentMethodFormData) => void;
}

export function paymentQrText(input: {
  payer: CheckoutPayer;
  bookTitle: string;
  amount: number;
  currency: string;
  method: string;
  receiver: string;
}) {
  return [
    "FOLIO PAY",
    `Name: ${input.payer.name}`,
    `ID: ${input.payer.id}`,
    `Email: ${input.payer.email}`,
    `Book: ${input.bookTitle}`,
    `Price: ${input.currency}${input.amount}`,
    `Method: ${input.method}`,
    `Receiver: ${input.receiver}`,
  ].join("\n");
}

export default function PaymentForm({
  paymentMethods,
  payer,
  bookTitle,
  amount,
  currency,
  defaultValues,
  onBack,
  onSubmit,
}: PaymentFormProps) {
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaymentMethodValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      methodId: defaultValues?.methodId ?? "bkash",
    },
  });

  const methodId = watch("methodId");

  const selectedMethod =
    paymentMethods.find((method) => method.id === methodId) ??
    paymentMethods[0];

  async function copyMerchantNumber() {
    if (!selectedMethod) return;
    await navigator.clipboard.writeText(selectedMethod.merchantNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const handleFormSubmit: SubmitHandler<PaymentMethodValues> = (data) => {
    onSubmit(data);
  };

  return (
    <section className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="card-body gap-5 p-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-slate-800">
            Payment Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose a method, send the money, then confirm your order to enter
            the Transaction ID.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <input type="hidden" {...register("methodId")} />
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const isActive = methodId === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setValue("methodId", method.id, { shouldValidate: true })
                    }
                    className={`card border bg-white transition ${
                      isActive
                        ? method.borderActiveClass
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="card-body items-center p-4">
                      <div className="relative h-12 w-full">
                        <Image
                          src={method.logoSrc}
                          alt={method.name}
                          fill
                          sizes="120px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.methodId && (
              <span className="text-red-400">{errors.methodId.message}</span>
            )}
          </div>

          {selectedMethod && (
            <div
              className={`rounded-xl border p-4 ${selectedMethod.panelClass}`}
            >
              <p
                className={`text-sm font-semibold ${selectedMethod.accentClass}`}
              >
                Send Money via {selectedMethod.name}
              </p>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-white bg-white p-3">
                <span className="flex-1 font-mono text-sm text-slate-700">
                  {selectedMethod.merchantNumber}
                </span>
                <button
                  type="button"
                  onClick={copyMerchantNumber}
                  className={`btn btn-sm rounded-lg text-white ${selectedMethod.copyButtonClass}`}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <dl className="mt-4 space-y-1 text-sm text-slate-700">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Name</dt>
                  <dd className="font-medium">{payer.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">ID</dt>
                  <dd className="truncate font-mono text-xs">{payer.id}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="truncate">{payer.email || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Price</dt>
                  <dd className="font-semibold">
                    {currency}
                    {amount}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex justify-center rounded-xl bg-white p-3">
                <QRCodeSVG
                  value={paymentQrText({
                    payer,
                    bookTitle,
                    amount,
                    currency,
                    method: selectedMethod.name,
                    receiver: selectedMethod.merchantNumber,
                  })}
                  size={180}
                  level="M"
                  includeMargin
                />
              </div>
              <p className="mt-2 text-center text-xs text-slate-500">
                Scan this code to pay {currency}
                {amount} to {selectedMethod.merchantNumber}.
              </p>

              <ol className="mt-4 list-decimal space-y-1 pl-4 text-xs text-slate-600">
                {selectedMethod.instructions.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr]">
            <button type="button" onClick={onBack} className="btn btn-outline">
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Continuing..." : "I Paid — Enter Txn ID"}
              <Image
                src="/svg/arrow-right.svg"
                alt="Continue"
                width={16}
                height={16}
                className="size-4"
              />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
