// one labeled input / textarea / select for modal forms

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required,
  as = "input",
  options,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  as?: "input" | "textarea" | "select";
  options?: string[];
}) {
  return (
    <fieldset className="fieldset p-0">
      <legend className="fieldset-legend">{label}</legend>
      {as === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          rows={4}
          className="textarea w-full"
        />
      ) : as === "select" ? (
        <select
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="select w-full"
        >
          {(options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          className="input w-full"
        />
      )}
    </fieldset>
  );
}
