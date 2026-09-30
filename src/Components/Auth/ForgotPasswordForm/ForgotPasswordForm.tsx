"use client";

import AuthField from "@/Components/Auth/AuthField/AuthField";
import { request_password_reset } from "@/Controller/users.controller";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import z from "zod";

const Form_schema = z.object({
  email: z.email("Please enter a valid email address"),
});

type FormField = z.infer<typeof Form_schema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormField>({
    resolver: zodResolver(Form_schema),
  });

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    setFormError("");
    try {
      const res = await request_password_reset(data.email);
      const token = res?.data?.token;
      if (!res?.success || typeof token !== "string" || !token) {
        setFormError(res?.message || "Could not start a password reset.");
        return;
      }

      router.push(`/reset-password?token=${encodeURIComponent(token)}`);
    } catch {
      setFormError("Could not reach the server.");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Forgot password
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter the email on your Folio account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField
          {...register("email")}
          type="email"
          placeholder="Email address"
          icon={<Image src="/svg/envelope.svg" alt="Email" width={16} height={16} />}
          error={errors.email?.message}
        />

        {formError ? <p className="text-error text-sm">{formError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-block"
        >
          {isSubmitting ? "Checking email..." : "Continue"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-semibold text-sky-500 hover:text-sky-600"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
