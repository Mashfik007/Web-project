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
        <label className="input w-full">
          <span className="text-primary">{icon}</span>
          <input ref={ref} {...props} />
          {rightSlot}
        </label>
        {error ? <p className="text-error mt-1.5 text-sm">{error}</p> : null}
      </div>
    );
  },
);

export default AuthField;
