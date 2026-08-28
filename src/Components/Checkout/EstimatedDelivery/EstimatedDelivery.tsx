interface EstimatedDeliveryProps {
  message: string;
}

export default function EstimatedDelivery({ message }: EstimatedDeliveryProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
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
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-sky-700">Estimated Delivery</p>
        <p className="mt-0.5 text-xs text-sky-600">{message}</p>
      </div>
    </div>
  );
}
