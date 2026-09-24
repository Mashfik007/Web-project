"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ShelfPerson } from "@/types/myShelf";

interface FollowListProps {
  userId: string;
  people: ShelfPerson[];
}

export default function FollowList({ userId, people }: FollowListProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pendingId, setPendingId] = useState("");

  async function toggleFollow(person: ShelfPerson) {
    setPendingId(person.id);
    setMessage("");

    try {
      const response = await fetch("/api/users/shelf/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, targetId: person.id }),
      });
      const payload = await response.json();
      setMessage(payload.message || "Could not update follow");
      if (response.ok) router.refresh();
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setPendingId("");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">Members</h2>
      <p className="mt-1 text-xs text-slate-500">
        Follow other readers to keep their shelves close.
      </p>

      {people.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No other members yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {people.map((person) => (
            <li key={person.id} className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-medium text-slate-700">
                {person.name}
              </span>
              <button
                type="button"
                disabled={pendingId === person.id}
                onClick={() => toggleFollow(person)}
                className={`btn btn-xs ${person.following ? "btn-ghost" : "btn-primary"}`}
              >
                {person.following ? "Unfollow" : "Follow"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {message ? <p className="mt-3 text-xs text-slate-500">{message}</p> : null}
    </section>
  );
}
