"use client";

import { getChatSocket } from "@/lib/chatSocket";
import type { CommunityGroupCard } from "@/data/getCommunityGroupCards";
import { useEffect, useState } from "react";

export default function CommunityGroups({ groups }: { groups: CommunityGroupCard[] }) {
  const [items, setItems] = useState(groups);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(groups);
  }, [groups]);

  async function join(groupId: string) {
    if (busyId) return;
    setBusyId(groupId);
    setError("");
    try {
      const response = await fetch("/api/users/community/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(payload.message || "Could not join this group");
        return;
      }
      setItems((current) =>
        current.map((group) =>
          group.id === groupId
            ? { ...group, joined: true, memberCount: group.joined ? group.memberCount : group.memberCount + 1 }
            : group,
        ),
      );
      getChatSocket().emit("rooms:sync");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-serif text-xl font-bold text-slate-800">Groups</h2>
        <p className="mt-1 text-sm text-slate-500">
          Join a group to see it in chat and talk with other members.
        </p>
      </div>

      {error ? <p className="mb-3 text-sm text-rose-500">{error}</p> : null}

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">No groups yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((group) => (
            <li
              key={group.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <h3 className="text-sm font-semibold text-slate-800">{group.name}</h3>
              <p className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-slate-500">
                {group.description}
              </p>
              <p className="mt-3 text-[11px] font-medium text-slate-400">
                {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
              </p>
              {group.joined ? (
                <span className="btn btn-sm mt-3 cursor-default border-emerald-200 bg-emerald-50 text-emerald-700">
                  Joined
                </span>
              ) : (
                <button
                  type="button"
                  disabled={busyId === group.id}
                  onClick={() => {
                    void join(group.id);
                  }}
                  className="btn btn-primary btn-sm mt-3"
                >
                  {busyId === group.id ? "Joining..." : "Join"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
