"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ConfirmModal,
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
  userId: string;
  onWantToReadChange?: () => void | Promise<void>;
}

type SeriesMatch = {
  bookId: string;
  title: string;
  author: string;
  series: string;
  volume: number;
  available: boolean;
  availability: { current: number; total: number };
  usedAi?: boolean;
  reason?: string;
};

export default function RemixHeader({
  header,
  userId,
  onWantToReadChange,
}: RemixHeaderProps) {
  const router = useRouter();
  const feedback = useFeedback();
  const [seriesMatch, setSeriesMatch] = useState<SeriesMatch | null>(null);

  async function startBlindDate(form: HTMLFormElement) {
    if (!formHasValues(form, ["mood", "length"])) {
      feedback.failed(
        "Could not match",
        "Choose a mood and length for your surprise book.",
      );
      return false;
    }

    const data = new FormData(form);
    try {
      const response = await fetch("/api/users/for-you/blind-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          mood: String(data.get("mood") ?? ""),
          length: String(data.get("length") ?? ""),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        feedback.failed(
          "Could not match",
          payload.message || "No surprise book could be wrapped.",
        );
        return false;
      }

      const usedAi = Boolean(payload.data?.usedAi);
      feedback.success(
        usedAi ? "AI found your date" : "Your date is ready",
        payload.message ||
          "A wrapped pick was added to Want to Read on your shelf.",
      );
      await onWantToReadChange?.();
      router.refresh();
      return true;
    } catch {
      feedback.failed("Could not match", "Could not reach the server.");
      return false;
    }
  }

  async function findNextVolume(form: HTMLFormElement) {
    if (!formHasValues(form, ["series"])) {
      feedback.failed(
        "Series not found",
        "Enter a series name to find the next volume.",
      );
      return false;
    }

    const data = new FormData(form);
    const series = String(data.get("series") ?? "").trim();
    const volume = Number(data.get("volume") || 1);

    try {
      const response = await fetch("/api/users/for-you/series-next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ series, volume }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setSeriesMatch(null);
        feedback.failed(
          "Series not found",
          payload.message || "Could not find the next volume.",
        );
        return false;
      }

      const match = payload.data as SeriesMatch;
      setSeriesMatch(match);

      if (!match.available) {
        feedback.failed(
          "Volume unavailable",
          `"${match.title}" (vol. ${match.volume}) is in the catalog but has no copies available right now.`,
        );
        return false;
      }

      if (match.usedAi) {
        feedback.success(
          "AI found next volume",
          match.reason ||
            `"${match.title}" looks like volume ${match.volume}. Confirm to reserve.`,
        );
      }

      openModal("series-reserve");
      return true;
    } catch {
      feedback.failed("Series not found", "Could not reach the server.");
      return false;
    }
  }

  async function reserveNextVolume() {
    if (!seriesMatch?.available) return;

    try {
      const response = await fetch("/api/users/for-you/series-reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: seriesMatch.bookId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        feedback.failed(
          "Could not reserve",
          payload.message || "Reservation failed.",
        );
        return;
      }

      feedback.success(
        "Volume reserved",
        payload.message ||
          `"${seriesMatch.title}" was reserved and added to your shelf.`,
      );
      setSeriesMatch(null);
      await onWantToReadChange?.();
      router.refresh();
    } catch {
      feedback.failed("Could not reserve", "Could not reach the server.");
    }
  }

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
        {header.topCategories.map((item, index) => (
          <div key={item.category} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-sm font-medium text-slate-400">+</span>
            )}
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: item.color }}
            >
              #{item.rank} {item.category} {item.percentage}%
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
            src="/svg/heart.svg"
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
            src="/svg/sparkles.svg"
            alt="Remix"
            width={16}
            height={16}
            className="size-4"
          />
          Series Navigator
        </button>

        <button
          type="button"
          onClick={() => {
            void onWantToReadChange?.();
          }}
          className="btn btn-ghost"
        >
          Want to Read
        </button>
      </div>

      <FormModal
        id="blind-date"
        title="Start a Blind Date"
        submitLabel="Match with AI"
        loadingLabel="Choosing for you..."
        onSubmit={startBlindDate}
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
        <p className="text-xs text-slate-500">
          AI picks from your real available catalog (and your shelf tastes),
          wraps the cover, and adds it under Want to Read on My Shelf.
        </p>
      </FormModal>

      <FormModal
        id="series-navigator"
        title="Series Navigator"
        submitLabel="Find with AI"
        loadingLabel="Searching your catalog..."
        onSubmit={findNextVolume}
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
          defaultValue="1"
        />
        <p className="text-xs text-slate-500">
          AI searches your real catalog for the next volume after the one you
          entered, then checks stock before you reserve.
        </p>
      </FormModal>

      <ConfirmModal
        id="series-reserve"
        title="Reserve next volume"
        message={
          seriesMatch
            ? `"${seriesMatch.title}" is volume ${seriesMatch.volume} of ${seriesMatch.series}. ${seriesMatch.availability.current} of ${seriesMatch.availability.total} copies are available. Reserve it and add it to Want to Read?`
            : "Reserve this volume?"
        }
        confirmLabel="Reserve"
        onConfirm={() => {
          void reserveNextVolume();
        }}
      />

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </section>
  );
}
