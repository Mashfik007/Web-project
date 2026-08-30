import Image from "next/image";
import usersIcon from "@svg/users.svg";
import type { BookDetails } from "@/types/bookDetails";

interface CommunityShelfProps {
  community: BookDetails["community"];
}

export default function CommunityShelf({ community }: CommunityShelfProps) {
  const visibleMembers = community.members.slice(0, 4);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Image
            src={usersIcon}
            alt="Users"
            width={16}
            height={16}
            className="size-4"
          />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Community Shelf
        </h3>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {community.totalOnShelf} members have this on their shelf right now
      </p>

      <div className="mt-4 flex -space-x-2">
        {community.members.map((member) => (
          <span
            key={member.id}
            className={`flex size-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${member.color}`}
            title={member.name}
          >
            {member.initials}
          </span>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {visibleMembers.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${member.color}`}
              >
                {member.initials}
              </span>
              <span className="font-medium text-slate-700">{member.name}</span>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
              On shelf
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
