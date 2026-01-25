export default function InputField({
    label,
    value,
    onChange,
    type = "number",
    step
  }) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold tracking-wide text-ink/80">
          {label}
        </label>
  
        <input
          type={type}
          step={step}
          value={value ?? ""}
          onChange={e => onChange(e.target.value)}
          className="
            w-full
            rounded-xl
            border-2 border-brass/100
            bg-parchment/20
            px-4 py-2.5
            text-ink
            shadow-sm
            placeholder:text-ink/40
            focus:outline-none
            focus:ring-2 focus:ring-primary/60
            focus:border-primary
          "
        />
      </div>
    );
  }
  