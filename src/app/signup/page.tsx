"use client";

import { register_user } from "@/Controller/users.controller";
import { Form_shema } from "@/Shchema/users";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export default function page() {
  type FormData = z.infer<typeof Form_shema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(Form_shema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    register_user(data);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>

          <p className="mt-2 text-sm text-slate-500">
            Fill in your information to create a new account.
          </p>
        </div>

        {/* Form */}
        <form
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.name && (
              <span className="text-red-400">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.email && (
              <span className="text-red-400">{errors.email.message}</span>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+880 1XXXXXXXXX"
              {...register("phone")}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />{" "}
            {errors.phone && (
              <span className="text-red-400">{errors.phone.message}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password")}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.password && (
              <span className="text-red-400">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="md:col-span-2">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmpassword")}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.confirmpassword && (
              <span className="text-red-400">
                {errors.confirmpassword.message}
              </span>
            )}
          </div>
          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
