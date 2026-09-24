"use client";

import AuthField from "@/Components/Auth/AuthField/AuthField";
import { login_user } from "@/Controller/users.controller";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const Form_schema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password length must be atleast 8")
    .max(10, "Password length can not  be more than 10"),
});

type FormField = z.infer<typeof Form_schema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormField>({
    resolver: zodResolver(Form_schema),
  });

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    try {
      const res = await login_user(data);
      const id = res?.data?._id;
      const isAdmin = res?.data?.isAdmin === true;
      if (!res?.success || !id) {
        setError("email", {
          message: res?.message || "Email or password is incorrect",
        });
        return;
      }

      router.push(isAdmin ? `/admin/${id}` : `/user/${id}`);
      router.refresh();
    } catch {
      setError("email", { message: "Could not reach the server." });
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to continue your reading journey
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

        <AuthField
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
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

        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-link btn-sm text-primary px-0"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-block"
        >
          <Image src="/svg/login.svg" alt="Sign in" width={18} height={18} />
          {isSubmitting ? "Signing in..." : "Sign In to Folio"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to Folio?{" "}
        <Link
          href="/signup"
          className="font-semibold text-sky-500 hover:text-sky-600"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
