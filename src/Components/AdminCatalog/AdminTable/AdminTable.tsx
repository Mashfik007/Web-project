import type { ReactNode } from "react";

interface AdminTableProps {
  columns: string[];
  children: ReactNode;
  from: number;
  to: number;
  total: number;
}

export default function AdminTable({
  columns,
  children,
  from,
  to,
  total,
}: AdminTableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-base-200 px-4 py-3">
        <p className="text-xs text-base-content/40">
          Showing {from}-{to} of {total} records
        </p>
        <div className="join">
          <button type="button" className="btn join-item btn-sm btn-ghost">
            ‹
          </button>
          <button type="button" className="btn join-item btn-sm btn-primary">
            1
          </button>
          <button type="button" className="btn join-item btn-sm">
            2
          </button>
          <button type="button" className="btn join-item btn-sm btn-ghost">
            ›
          </button>
        </div>
      </div>
    </>
  );
}
