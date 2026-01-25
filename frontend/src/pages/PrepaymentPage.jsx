import { useState } from "react";
import { optimizePrepaymentTiming } from "../api/optimizer.api";
import Card from "../components/Card";
import InputField from "../components/InputField";
import MetricCard from "../components/MetricCard";
import { formatNumber } from "../utils/formatNumber";
import { useScenario } from "../context/ScenarioContext";
import AlertModal from "../components/AlertModal";

export default function PrepaymentPage() {
  const { scenario, setScenario, resetScenario } = useScenario();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const result = scenario.prepaymentResult;

  async function handleOptimize() {
    if (
      !scenario.initialBalance ||
      !scenario.prepaymentAmount ||
      !scenario.searchMonths ||
      !scenario.prepaymentAnnualRate
    ) {
      setAlertMessage(
        "Please fill all fields before optimizing prepayment timing."
      );
      return;
    }

    setLoading(true);

    const data = await optimizePrepaymentTiming({
      initialBalance: Number(scenario.initialBalance),
      annualRate: Number(scenario.prepaymentAnnualRate),
      prepaymentAmount: Number(scenario.prepaymentAmount),
      searchMonths: Number(scenario.searchMonths)
    });

    setScenario(s => ({
      ...s,
      prepaymentResult: data
    }));

    setLoading(false);
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold tracking-wide text-ink border-b border-brass/40 pb-4">
        Prepayment Timing Optimizer
      </h1>

      <Card title="Ritual Inputs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Initial Balance"
            value={scenario.initialBalance}
            onChange={v =>
              setScenario(s => ({ ...s, initialBalance: v }))
            }
          />

          <InputField
            label="Loan Interest Rate (%)"
            value={scenario.prepaymentAnnualRate}
            onChange={v =>
              setScenario(s => ({ ...s, prepaymentAnnualRate: v }))
            }
          />

          <InputField
            label="Lump-Sum Prepayment Amount"
            value={scenario.prepaymentAmount}
            onChange={v =>
              setScenario(s => ({ ...s, prepaymentAmount: v }))
            }
          />

          <InputField
            label="Months to Evaluate"
            value={scenario.searchMonths}
            onChange={v =>
              setScenario(s => ({ ...s, searchMonths: v }))
            }
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleOptimize}
          disabled={loading}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition disabled:opacity-50"
        >
          {loading ? "Divining Optimal Moment..." : "Find Best Timing"}
        </button>

        <button
          onClick={resetScenario}
          type="button"
          className="ml-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition"
        >
          Reset all inputs
        </button>
      </div>

      {result && (
        <Card title="Divination Result">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              label="Best Month"
              value={`Month ${result.bestMonth}`}
            />
            <MetricCard
              label="Interest Saved"
              value={`₹ ${formatNumber(result.maxInterestSaved, 2)}`}
            />
          </div>
        </Card>
      )}

      <AlertModal
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
    </div>
  );
}
