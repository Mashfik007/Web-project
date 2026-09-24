export default function FilterSelect({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <select
      name={name}
      className="select"
      value={onChange ? (value ?? "All") : undefined}
      defaultValue={onChange ? undefined : "All"}
      onChange={
        onChange ? (event) => onChange(event.target.value) : undefined
      }
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === "all" ? "All" : option}
        </option>
      ))}
    </select>
  );
}
