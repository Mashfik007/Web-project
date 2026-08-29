export default function FilterSelect({
  name,
  options,
}: {
  name: string;
  options: string[];
}) {
  return (
    <select name={name} defaultValue="All" className="select">
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
