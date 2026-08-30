import Image from "next/image";
import eyeIcon from "@svg/eye.svg";
export default function ViewButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="View"
      onClick={onClick}
      className="btn btn-ghost btn-square btn-sm"
    >
      <Image
        src={eyeIcon}
        alt="View"
        width={16}
        height={16}
        className="size-4"
      />
    </button>
  );
}
