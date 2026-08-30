"use client";

import Image from "next/image";
import {
  deliveryFormSchema,
  type DeliveryFormValues,
} from "@/Shchema/checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import type { CheckoutDelivery, DeliveryFormData } from "@/types/checkout";

interface DeliveryFormProps {
  delivery: CheckoutDelivery;
  defaultValues?: DeliveryFormData;
  onQuantityChange?: (quantity: number) => void;
  onSubmit: (data: DeliveryFormData) => void;
}

const inputClassName = "input w-full";

export default function DeliveryForm({
  delivery,
  defaultValues,
  onQuantityChange,
  onSubmit,
}: DeliveryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      phone: defaultValues?.phone ?? "",
      address: defaultValues?.address ?? "",
      city: defaultValues?.city ?? delivery.defaultCity,
      quantity: defaultValues?.quantity ?? 1,
    },
  });

  const quantity = watch("quantity");

  useEffect(() => {
    onQuantityChange?.(quantity);
  }, [quantity, onQuantityChange]);

  const handleFormSubmit: SubmitHandler<DeliveryFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <section className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="card-body gap-5 p-5">
        <h2 className="font-serif text-xl font-bold text-slate-800">
          Delivery Details
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <input
            type="hidden"
            {...register("quantity", { valueAsNumber: true })}
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Your full name"
              className={inputClassName}
            />
            {errors.fullName && (
              <span className="text-red-400">{errors.fullName.message}</span>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="01XXXXXXXXX"
              className={inputClassName}
            />
            {errors.phone && (
              <span className="text-red-400">{errors.phone.message}</span>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Address
            </label>
            <input
              {...register("address")}
              type="text"
              placeholder="House, Road, Area"
              className={inputClassName}
            />
            {errors.address && (
              <span className="text-red-400">{errors.address.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                City
              </label>
              <select {...register("city")} className="select w-full">
                {delivery.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <span className="text-red-400">{errors.city.message}</span>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <div className="join">
                <button
                  type="button"
                  onClick={() =>
                    setValue("quantity", Math.max(1, quantity - 1), {
                      shouldValidate: true,
                    })
                  }
                  className="btn join-item"
                >
                  −
                </button>
                <span className="btn join-item no-animation pointer-events-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setValue("quantity", Math.min(10, quantity + 1), {
                      shouldValidate: true,
                    })
                  }
                  className="btn join-item"
                >
                  +
                </button>
              </div>
              {errors.quantity && (
                <span className="text-red-400">{errors.quantity.message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary mt-2 w-full"
          >
            {isSubmitting ? "Submitting..." : "Continue to Payment"}
            <Image
              src="/svg/arrow-right.svg"
              alt="Continue"
              width={16}
              height={16}
              className="size-4"
            />
          </button>
        </form>
      </div>
    </section>
  );
}
