import type { ReactNode } from "react";

export default function AdminCard({ children }: { children: ReactNode }) {
  return <section className="card bg-base-100 shadow-sm">{children}</section>;
}
