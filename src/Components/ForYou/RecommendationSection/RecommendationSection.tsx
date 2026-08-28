import RecommendationCard from "../RecommendationCard/RecommendationCard";
import type { RecommendationSection as RecommendationSectionData } from "@/types/forYou";

interface RecommendationSectionProps {
  section: RecommendationSectionData;
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

function SectionIcon({ theme }: { theme: RecommendationSectionData["iconTheme"] }) {
  if (theme === "orange") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M21 3l-9 9" />
      <path d="M3 3l9 9" />
      <path d="M16 21h5v-5" />
      <path d="M8 21H3v-5" />
      <path d="M21 21l-9-9" />
      <path d="M3 21l9-9" />
    </svg>
  );
}

function renderDescription(
  description: string,
  highlightGenres?: string[],
) {
  if (!highlightGenres?.length) {
    return description;
  }

  const parts = description.split(
    new RegExp(`(${highlightGenres.join("|")})`, "g"),
  );

  return parts.map((part, index) =>
    highlightGenres.includes(part) ? (
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
              {renderDescription(section.description, section.highlightGenres)}
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
          <RecommendationCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
