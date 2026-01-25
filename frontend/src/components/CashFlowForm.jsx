import InputField from "./InputField";

export default function CashFlowForm({
  cashFlow,
  initialBalance,
  onBalanceChange,
  onChange
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-xl border border-brass/40 bg-parchment p-4 shadow-sm">
        <InputField
          label="Initial Balance"
          value={initialBalance}
          onChange={onBalanceChange}
        />
      </div>

      <div className="rounded-xl border border-brass/40 bg-parchment p-4 shadow-sm">
        <InputField
          label="Monthly Income"
          value={cashFlow.monthlyIncome}
          onChange={v => onChange("monthlyIncome", v)}
        />
      </div>

      <div className="rounded-xl border border-brass/40 bg-parchment p-4 shadow-sm">
        <InputField
          label="Monthly Expenses"
          value={cashFlow.monthlyExpenses}
          onChange={v => onChange("monthlyExpenses", v)}
        />
      </div>

      <div className="rounded-xl border border-brass/40 bg-parchment p-4 shadow-sm">
        <InputField
          label="Safe Balance Threshold"
          value={cashFlow.safeBalance}
          onChange={v => onChange("safeBalance", v)}
        />
      </div>
    </div>
  );
}
