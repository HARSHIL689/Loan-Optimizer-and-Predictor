import MetricCard from "./MetricCard";
import { formatNumber } from "../utils/formatNumber";

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-wide text-ink border-b border-brass/40 pb-3">
        Optimization Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          label="Months to Debt-Free"
          value={result.months}
          subtext="Lower is better"
        />

        <MetricCard
          label="Total Interest Paid"
          value={`₹ ${formatNumber(result.totalInterestPaid, 2)}`}
          subtext="Across all loans"
        />
      </div>
    </div>
  );
}
