import InputField from "./InputField";

export default function LoanForm({ loans, onUpdate, onAdd }) {
  return (
    <div className="space-y-8">
      {loans.map((loan, index) => (
        <div
          key={loan.id}
          className="rounded-xl border border-brass/40 bg-parchment p-4 shadow-sm"
        >
          {/* Loan Header */}
          <div className="mb-4 text-sm font-semibold text-ink/70">
            Loan {index + 1}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Principal"
              value={loan.principal}
              onChange={v => onUpdate(index, "principal", v)}
            />

            <InputField
              label="Annual Interest (%)"
              value={loan.annualRate}
              onChange={v => onUpdate(index, "annualRate", v)}
              step="0.01"
            />

            <InputField
              label="Minimum EMI"
              value={loan.minEmi}
              onChange={v => onUpdate(index, "minEmi", v)}
            />
          </div>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition disabled:opacity-50"
      >
        + Add another loan
      </button>
    </div>
  );
}
