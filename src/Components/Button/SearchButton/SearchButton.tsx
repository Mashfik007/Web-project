interface SearchButtonProps {
  label: string;
}

export default function SearchButton({ label }: SearchButtonProps) {
  return (
    <button type="button" className="btn btn-ghost text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>

      {label}
    </button>
  );
}
