"use client";

import {
  confirmPaymentSchema,
  type ConfirmPaymentValues,
} from "@/Shchema/checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import type { ConfirmPaymentFormData, PaymentMethod } from "@/types/checkout";

interface ConfirmPaymentFormProps {
  bookTitle: string;
  amount: number;
  currency: string;
  selectedMethod?: PaymentMethod;
  defaultValues?: ConfirmPaymentFormData;
  submitting?: boolean;
  error?: string;
  onBack: () => void;
  onSubmit: (data: ConfirmPaymentFormData) => void;
}

const inputClassName = "input w-full";

export default function ConfirmPaymentForm({
  bookTitle,
  amount,
  currency,
  selectedMethod,
  defaultValues,
  submitting = false,
  error = "",
  onBack,
  onSubmit,
}: ConfirmPaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmPaymentValues>({
    resolver: zodResolver(confirmPaymentSchema),
    defaultValues: {
      transactionId: defaultValues?.transactionId ?? "",
      paymentPhone: defaultValues?.paymentPhone ?? "",
    },
  });

  const busy = submitting || isSubmitting;

  const handleFormSubmit: SubmitHandler<ConfirmPaymentValues> = (data) => {
    onSubmit(data);
  };

  return (
    <section className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="card-body gap-5 p-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-slate-800">
            Confirm Purchase
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the Transaction ID from your{" "}
            {selectedMethod?.name ?? "payment"} payment to confirm that{" "}
            <span className="font-medium text-slate-700">{bookTitle}</span> has
            been purchased.
          </p>
        </div>

        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700">
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Amount paid</span>
            <span className="font-semibold">
              {currency}
              {amount}
            </span>
          </div>
          {selectedMethod ? (
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-slate-500">Method</span>
              <span className="font-semibold">{selectedMethod.name}</span>
            </div>
          ) : null}
          {selectedMethod ? (
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-slate-500">Sent to</span>
              <span className="font-mono font-semibold">
                {selectedMethod.merchantNumber}
              </span>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Transaction ID (TxnID)
            </label>
            <input
              {...register("transactionId")}
              type="text"
              placeholder="e.g. BA7B2D3F9K"
              className={inputClassName}
              autoComplete="off"
            />
            {errors.transactionId && (
              <span className="text-red-400">
                {errors.transactionId.message}
              </span>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number Used
            </label>
            <input
              {...register("paymentPhone")}
              type="tel"
              placeholder="01XXXXXXXXX"
              className={inputClassName}
            />
            {errors.paymentPhone && (
              <span className="text-red-400">
                {errors.paymentPhone.message}
              </span>
            )}
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr]">
            <button
              type="button"
              onClick={onBack}
              disabled={busy}
              className="btn btn-outline"
            >
              Back
            </button>
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? "Confirming..." : "Confirm Purchase"}
              <Image
                src="/svg/check-circle.svg"
                alt="Confirm"
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
