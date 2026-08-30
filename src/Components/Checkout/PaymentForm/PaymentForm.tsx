"use client";

import arrowRightIcon from "@svg/arrow-right.svg";
import { paymentFormSchema, type PaymentFormValues } from "@/Shchema/checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import type { PaymentFormData, PaymentMethod } from "@/types/checkout";

interface PaymentFormProps {
  paymentMethods: PaymentMethod[];
  defaultValues?: PaymentFormData;
  onBack: () => void;
  onSubmit: (data: PaymentFormData) => void;
}

const inputClassName = "input w-full";

export default function PaymentForm({
  paymentMethods,
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
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      methodId: defaultValues?.methodId ?? "bkash",
      transactionId: defaultValues?.transactionId ?? "",
      paymentPhone: defaultValues?.paymentPhone ?? "",
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

  const handleFormSubmit: SubmitHandler<PaymentFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <section className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="card-body gap-5 p-5">
        <h2 className="font-serif text-xl font-bold text-slate-800">
          Payment Details
        </h2>

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

              <ol className="mt-4 list-decimal space-y-1 pl-4 text-xs text-slate-600">
                {selectedMethod.instructions.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Transaction ID (TxnID)
            </label>
            <input
              {...register("transactionId")}
              type="text"
              placeholder="e.g. BA7B2D3F9K"
              className={inputClassName}
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr]">
            <button type="button" onClick={onBack} className="btn btn-outline">
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Submitting..." : "Review Order"}
              <Image
                src={arrowRightIcon}
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
