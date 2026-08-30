import Image from "next/image";
import searchIcon from "@svg/search.svg";
interface SearchButtonProps {
  label: string;
}

export default function SearchButton({ label }: SearchButtonProps) {
  return (
    <button type="button" className="btn btn-ghost text-white">
      <Image
        src={searchIcon}
        alt="Search"
        width={16}
        height={16}
        className="size-4"
      />

      {label}
    </button>
  );
}
