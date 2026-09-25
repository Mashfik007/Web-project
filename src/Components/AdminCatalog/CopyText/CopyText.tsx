"use client";

import { useState } from "react";

export default function CopyText({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="btn btn-ghost btn-xs"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          },
          () => setCopied(false),
        );
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
