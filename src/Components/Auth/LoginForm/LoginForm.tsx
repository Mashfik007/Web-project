"use client";

import AuthField from "@/Components/Auth/AuthField/AuthField";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  LoginDoorIcon,
} from "@/Components/Auth/AuthIcons";
import { login_user } from "@/Controller/users.controller";
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
      console.log(res);

      if (true) {
        router.push("/profile/123");
      }
    } catch (error) {
      setError("email", { message: "The email is already taken" });
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
          icon={<EnvelopeIcon />}
          error={errors.email?.message}
        />

        <AuthField
          {...register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          icon={<LockIcon />}
          error={errors.password?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((open) => !open)}
              className="text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
        />

        <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-link btn-sm px-0 text-primary"
        >
          Forgot password?
        </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-block"
        >
          <LoginDoorIcon />
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
