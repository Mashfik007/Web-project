"use client";

import Image from "next/image";
import heartIcon from "@svg/heart.svg";
import sparklesIcon from "@svg/sparkles.svg";
import {
  FormField,
  FormModal,
  StatusModal,
  formHasValues,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import type { ForYouHeader } from "@/types/forYou";

interface RemixHeaderProps {
  header: ForYouHeader;
}

export default function RemixHeader({ header }: RemixHeaderProps) {
  const feedback = useFeedback();

  return (
    <section>
      <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
        {header.label}
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
        {header.title}{" "}
        <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text font-serif text-transparent italic">
          {header.titleAccent}
        </span>
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
        {header.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {header.topGenres.map((genre, index) => (
          <div key={genre.genre} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-sm font-medium text-slate-400">+</span>
            )}
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: genre.color }}
            >
              #{genre.rank} {genre.genre} {genre.percentage}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => openModal("blind-date")}
          className="btn btn-primary"
        >
          <Image
            src={heartIcon}
            alt="Favorite"
            width={16}
            height={16}
            className="size-4"
          />
          Blind Date
        </button>

        <button
          type="button"
          onClick={() => openModal("series-navigator")}
          className="btn btn-primary btn-outline"
        >
          <Image
            src={sparklesIcon}
            alt="Remix"
            width={16}
            height={16}
            className="size-4"
          />
          Series Navigator
        </button>
      </div>

      <FormModal
        id="blind-date"
        title="Start a Blind Date"
        submitLabel="Match me"
        onSubmit={(form) => {
          if (!formHasValues(form, ["mood", "length"])) {
            feedback.failed(
              "Could not match",
              "Choose a mood and length for your surprise book.",
            );
            return;
          }
          const data = new FormData(form);
          feedback.success(
            "Your date is ready",
            `A ${data.get("length")} ${data.get("mood")} pick is waiting on your shelf.`,
          );
        }}
      >
        <FormField
          label="Mood"
          name="mood"
          as="select"
          required
          options={["Curious", "Cozy", "Dark", "Hopeful", "Adventurous"]}
        />
        <FormField
          label="Length"
          name="length"
          as="select"
          required
          options={["Short read", "Standard", "Epic"]}
        />
      </FormModal>

      <FormModal
        id="series-navigator"
        title="Series Navigator"
        submitLabel="Find next book"
        onSubmit={(form) => {
          if (!formHasValues(form, ["series"])) {
            feedback.failed(
              "Series not found",
              "Enter a series name to find the next volume.",
            );
            return;
          }
          const data = new FormData(form);
          feedback.success(
            "Next volume found",
            `"${data.get("series")}" — volume ${data.get("volume") || "2"} is available to reserve.`,
          );
        }}
      >
        <FormField
          label="Series name"
          name="series"
          placeholder="e.g. Dune"
          required
        />
        <FormField
          label="Last volume read"
          name="volume"
          type="number"
          placeholder="1"
        />
      </FormModal>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </section>
  );
}
