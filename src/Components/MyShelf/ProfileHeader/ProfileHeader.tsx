import type { ShelfUser } from "@/types/myShelf";

interface ProfileHeaderProps {
  user: ShelfUser;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-24 bg-gradient-to-r from-sky-100 via-sky-50 to-white" />

      <div className="relative px-6 pb-6">
        <div className="absolute -top-10 left-6">
          <div className="relative">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-sky-500 text-2xl font-bold text-white shadow-md">
              {user.initials}
            </div>
            <span className="absolute -right-1 -bottom-1 flex items-center gap-0.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
              🔥 {user.streakDays}
            </span>
          </div>
        </div>

        <div className="pt-14">
          <h1 className="font-serif text-2xl font-bold text-slate-800">
            {user.name}
          </h1>

          <p className="mt-1 text-sm text-slate-500 italic">
            &ldquo;{user.quote}&rdquo;
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {user.branch} · Member since {user.memberSince}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-slate-600">
              <strong className="text-slate-800">{user.followers}</strong>{" "}
              followers
            </span>
            <span className="text-slate-600">
              <strong className="text-slate-800">{user.following}</strong>{" "}
              following
            </span>
            <span className="text-slate-600">
              <strong className="text-slate-800">{user.booksThisYear}</strong>{" "}
              books this year
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
              🔥 {user.streakDays}-day streak
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
