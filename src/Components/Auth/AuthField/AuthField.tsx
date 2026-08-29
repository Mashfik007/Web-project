"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  error?: string;
  rightSlot?: ReactNode;
}

const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField({ icon, error, rightSlot, ...props }, ref) {
    return (
      <div>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sky-400">
            {icon}
          </span>
          <input
            ref={ref}
            {...props}
            className="w-full rounded-xl border border-sky-200 bg-white py-3.5 pr-11 pl-11 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          {rightSlot ? (
            <div className="absolute top-1/2 right-3.5 -translate-y-1/2">
              {rightSlot}
            </div>
          ) : null}
        </div>
        {error ? (
          <span className="mt-1.5 block text-sm text-red-400">{error}</span>
        ) : null}
      </div>
    );
  },
);

export default AuthField;
