import type { BookDetails } from "@/types/bookDetails";

interface DetailsTabProps {
  metadata: BookDetails["metadata"];
}

type DetailField = {
  label: string;
  value: string | number;
};

function DetailItem({ label, value }: DetailField) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export default function DetailsTab({ metadata }: DetailsTabProps) {
  const columns: DetailField[][] = [
    [
      { label: "Publisher", value: metadata.publisher },
      { label: "Language", value: metadata.language },
      { label: "Series", value: metadata.series },
    ],
    [
      { label: "ISBN", value: metadata.isbn },
      { label: "Published", value: metadata.published },
      { label: "Copies Held", value: metadata.copiesHeld },
    ],
    [
      { label: "Pages", value: `${metadata.pages} pages` },
      { label: "Category", value: metadata.category },
      { label: "Dewey Dec.", value: metadata.deweyDecimal },
    ],
  ];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="space-y-6">
          {column.map((field) => (
            <DetailItem key={field.label} {...field} />
          ))}
        </div>
      ))}
    </div>
  );
}
