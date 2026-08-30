import Image from "next/image";
import searchIcon from "@svg/search.svg";
import type { ReactNode } from "react";

export default function AdminSearchRow({
  placeholder,
  children,
}: {
  placeholder: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-base-200 flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
      <label className="input w-full min-w-0 flex-1">
        <Image
          src={searchIcon}
          alt="Search"
          width={16}
          height={16}
          className="size-4 opacity-50"
        />
        <input name="search" type="search" placeholder={placeholder} />
      </label>
      {children}
    </div>
  );
}
