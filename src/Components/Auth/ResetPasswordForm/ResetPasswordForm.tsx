"use client";

import AuthField from "@/Components/Auth/AuthField/AuthField";
import { reset_password } from "@/Controller/users.controller";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const Form_schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

type FormField = z.infer<typeof Form_schema>;

export default function ResetPasswordForm({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);
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
      const res = await reset_password({
        token,
        password: data.password,
        confirmpassword: data.confirmpassword,
      });
      if (!res?.success) {
        setFormError(res?.message || "Could not update the password.");
        return;
      }

      setDone(true);
    } catch {
      setFormError("Could not reach the server.");
    }
  };

  if (!token) {
    return (
      <>
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Reset link missing
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Start again with the email on your account.
          </p>
        </div>
        <Link href="/forgot-password" className="btn btn-primary btn-block">
          Forgot password
        </Link>
      </>
    );
  }

  if (done) {
    return (
      <>
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Password updated
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in with your new password.
          </p>
        </div>
        <Link href="/login" className="btn btn-primary btn-block">
          Sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Set a new password
        </h1>
        <p className="mt-2 text-sm text-slate-400">Use at least 8 characters</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="New password"
          icon={<Image src="/svg/lock.svg" alt="Password" width={16} height={16} />}
          error={errors.password?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((open) => !open)}
              className="text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Image
                  src="/svg/eye-off.svg"
                  alt="Hide password"
                  width={16}
                  height={16}
                />
              ) : (
                <Image
                  src="/svg/eye.svg"
                  alt="Show password"
                  width={16}
                  height={16}
                />
              )}
            </button>
          }
        />

        <AuthField
          {...register("confirmpassword")}
          type="password"
          placeholder="Confirm password"
          icon={<Image src="/svg/lock.svg" alt="Password" width={16} height={16} />}
          error={errors.confirmpassword?.message}
        />

        {formError ? <p className="text-error text-sm">{formError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-block"
        >
          {isSubmitting ? "Saving..." : "Update password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        <Link
          href="/login"
          className="font-semibold text-sky-500 hover:text-sky-600"
        >
          Back to sign in
        </Link>
      </p>
    </>
  );
}
