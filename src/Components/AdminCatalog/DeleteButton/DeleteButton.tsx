export default function DeleteButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Delete"
      onClick={onClick}
      className="btn btn-error btn-soft btn-square btn-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-4"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
      </svg>
    </button>
  );
}
