import Image from "next/image";
import type { CommunityShelfHeader } from "@/types/communityShelf";

interface CommunityHeaderProps {
  header: CommunityShelfHeader;
}

export default function CommunityHeader({ header }: CommunityHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-sky-500 uppercase">
          {header.brand}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-slate-800 md:text-4xl">
          {header.title}
        </h1>
        <p className="mt-1 text-sm text-sky-600">{header.subtitle}</p>
      </div>

      <button type="button" className="btn btn-primary">
        <Image
          src="/svg/plus.svg"
          alt="Add"
          width={16}
          height={16}
          className="size-4"
        />
        Request a Book
      </button>
    </div>
  );
}
