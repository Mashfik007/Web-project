import Image from "next/image";
import RecommendationCard from "../RecommendationCard/RecommendationCard";
import type { RecommendationSection as RecommendationSectionData } from "@/types/forYou";

interface RecommendationSectionProps {
  section: RecommendationSectionData;
  userId: string;
}

const iconThemes = {
  blue: {
    wrapper: "bg-sky-100 text-sky-600",
    badge: "bg-sky-50 text-sky-600",
  },
  orange: {
    wrapper: "bg-amber-100 text-amber-600",
    badge: "bg-amber-50 text-amber-600",
  },
};

function SectionIcon({
  theme,
}: {
  theme: RecommendationSectionData["iconTheme"];
}) {
  if (theme === "orange") {
    return (
      <Image
        src="/svg/plus.svg"
        alt="Add"
        width={16}
        height={16}
        className="size-4"
      />
    );
  }

  return (
    <Image
      src="/svg/expand.svg"
      alt="Expand"
      width={16}
      height={16}
      className="size-4"
    />
  );
}

function renderDescription(
  description: string,
  highlightCategories?: string[],
) {
  if (!highlightCategories?.length) {
    return description;
  }

  const parts = description.split(
    new RegExp(`(${highlightCategories.join("|")})`, "g"),
  );

  return parts.map((part, index) =>
    highlightCategories.includes(part) ? (
      <strong key={index} className="font-semibold text-slate-700">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default function RecommendationSection({
  section,
  userId,
}: RecommendationSectionProps) {
  const theme = iconThemes[section.iconTheme];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${theme.wrapper}`}
          >
            <SectionIcon theme={section.iconTheme} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {section.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {renderDescription(
                section.description,
                section.highlightCategories,
              )}
            </p>
          </div>
        </div>

        {section.badge && (
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-semibold ${theme.badge}`}
          >
            {section.badge}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {section.books.map((book) => (
          <RecommendationCard key={book.id} book={book} userId={userId} />
        ))}
      </div>
    </section>
  );
}
