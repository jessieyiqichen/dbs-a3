interface Option<T extends string> {
  value: T;
  label: string;
}

interface RadioGroupProps<T extends string> {
  name: string;
  legend: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** One question with a few choices, as a real fieldset and legend. */
export function RadioGroup<T extends string>({ name, legend, options, value, onChange }: RadioGroupProps<T>) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="t-body mb-2 font-extrabold text-ink">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className="clay flex min-h-12 cursor-pointer items-center gap-3 rounded-card bg-surface px-4 font-sans font-extrabold hover:bg-wash has-checked:bg-primary-soft has-checked:[--lip:var(--color-lip)] has-focus-visible:outline-3 has-focus-visible:outline-focus"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="size-4 accent-lip"
          />
          <span className="text-ink">{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
