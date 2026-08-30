import Image from "next/image";
export default function BookCell({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/svg/book.svg"
        alt="Book"
        width={16}
        height={16}
        className="text-primary size-4"
      />
      {title}
    </div>
  );
}
