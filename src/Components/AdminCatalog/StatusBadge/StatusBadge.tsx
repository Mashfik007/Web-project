export default function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "orange" | "purple" | "red" | "slate" | "sky" | "teal";
}) {
  const tones = {
    green: "badge-success",
    orange: "badge-warning",
    purple: "badge-secondary",
    red: "badge-error",
    slate: "badge-ghost",
    sky: "badge-info",
    teal: "badge-accent",
  };

  const extra = tone === "slate" ? tones[tone] : `badge-soft ${tones[tone]}`;

  return <span className={`badge badge-sm ${extra}`}>{label}</span>;
}
