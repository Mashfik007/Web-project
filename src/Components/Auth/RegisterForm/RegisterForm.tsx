"use client";

import AuthField from "@/Components/Auth/AuthField/AuthField";
import { register_user } from "@/Controller/users.controller";
import Image from "next/image";
import { Form_shema } from "@/Shchema/users";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

type FormData = z.infer<typeof Form_shema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(Form_shema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    register_user(data);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Create account
        </h1>
        <p className="mt-2 text-sm text-sky-500">
          Start your reading journey today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthField
          {...register("name")}
          type="text"
          placeholder="Full name"
          icon={<Image src="/svg/user.svg" alt="Full name" width={16} height={16} />}
          error={errors.name?.message}
        />

        <AuthField
          {...register("email")}
          type="email"
          placeholder="Email address"
          icon={<Image src="/svg/envelope.svg" alt="Email" width={16} height={16} />}
          error={errors.email?.message}
        />

        <AuthField
          {...register("phone")}
          type="tel"
          placeholder="Phone number"
          icon={<Image src="/svg/phone.svg" alt="Phone" width={16} height={16} />}
          error={errors.phone?.message}
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

        <AuthField
          {...register("confirmpassword")}
          type="password"
          placeholder="Confirm password"
          icon={<Image src="/svg/lock.svg" alt="Password" width={16} height={16} />}
          error={errors.confirmpassword?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-block"
        >
          {isSubmitting ? "Creating account..." : "Continue →"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
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
