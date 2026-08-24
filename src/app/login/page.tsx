"use client";

import { login_user } from "@/Controller/users.controller";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

const Form_schema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password length must be atleast 8")
    .max(10, "Password length can not  be more than 10"),
});

function Page() {
  type FormField = z.Infer<typeof Form_schema>;
  const router = useRouter();
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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>

          <p className="mt-2 text-sm text-slate-500">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.email && (
              <span className="text-red-400">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {errors.password && (
              <span className="text-red-400">{errors.password.message}</span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" />
              Remember me
            </label>

            <button type="button" className="text-blue-600 hover:underline">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            {isSubmitting ? "Submitting" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Page;
