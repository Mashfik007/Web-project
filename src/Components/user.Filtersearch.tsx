import React from "react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="border-b border-slate-200 px-4 py-4">
      <h3 className="mb-3 text-[10px] font-bold tracking-[0.15em] text-slate-500">
        {title}
      </h3>

      <div className="space-y-2">{children}</div>
    </section>
  );
}
