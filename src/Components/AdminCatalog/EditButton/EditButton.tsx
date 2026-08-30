import Image from "next/image";
export default function EditButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Edit"
      onClick={onClick}
      className="btn btn-ghost btn-square btn-sm"
    >
      <Image
        src="/svg/pencil.svg"
        alt="Edit"
        width={16}
        height={16}
        className="size-4"
      />
    </button>
  );
}
