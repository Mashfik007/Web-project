import Image from "next/image";
import trashIcon from "@svg/trash.svg";
export default function DeleteButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Delete"
      onClick={onClick}
      className="btn btn-error btn-soft btn-square btn-sm"
    >
      <Image
        src={trashIcon}
        alt="Delete"
        width={16}
        height={16}
        className="size-4"
      />
    </button>
  );
}
