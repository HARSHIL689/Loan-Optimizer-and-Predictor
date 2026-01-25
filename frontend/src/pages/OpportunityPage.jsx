import { useState } from "react";
import { analyzeOpportunity } from "../api/optimizer.api";
import Card from "../components/Card";
import InputField from "../components/InputField";
import MetricCard from "../components/MetricCard";
import { formatNumber } from "../utils/formatNumber";
import { useScenario } from "../context/ScenarioContext";
import AlertModal from "../components/AlertModal";

export default function OpportunityPage() {
  const { scenario, setScenario, resetScenario } = useScenario();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const result = scenario.opportunityResult;

  async function handleAnalyze() {
    if (
      !scenario.extraAmount ||
      !scenario.interestSaved ||
      !scenario.investmentRate ||
      !scenario.durationMonths
    ) {
      setAlertMessage("Please fill all fields before analyzing opportunity cost.");
      return;
    }

    setLoading(true);

    const data = await analyzeOpportunity({
      extraAmount: Number(scenario.extraAmount),
      interestSaved: Number(scenario.interestSaved),
      investmentRate: Number(scenario.investmentRate),
      durationMonths: Number(scenario.durationMonths)
    });

    setScenario(s => ({
      ...s,
      opportunityResult: data
    }));

    setLoading(false);
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold tracking-wide text-ink border-b border-brass/40 pb-4">
        Opportunity Cost Analyzer
      </h1>

      <Card title="Council Inputs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Extra Amount Available"
            value={scenario.extraAmount}
            onChange={v => setScenario(s => ({ ...s, extraAmount: v }))}
          />

          <InputField
            label="Interest Saved by Prepayment"
            value={scenario.interestSaved}
            onChange={v => setScenario(s => ({ ...s, interestSaved: v }))}
          />

          <InputField
            label="Investment Return Rate (%)"
            value={scenario.investmentRate}
            onChange={v => setScenario(s => ({ ...s, investmentRate: v }))}
            step="0.01"
          />

          <InputField
            label="Investment Duration (Months)"
            value={scenario.durationMonths}
            onChange={v => setScenario(s => ({ ...s, durationMonths: v }))}
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition disabled:opacity-50"
        >
          {loading ? "Consulting the Council..." : "Analyze Decision"}
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
        <Card title="Council Verdict">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              label="Investment Gain"
              value={`₹ ${formatNumber(result.investmentGain, 2)}`}
            />
            <MetricCard
              label="Net Financial Impact"
              value={`₹ ${formatNumber(result.netBenefit, 2)}`}
              subtext={result.recommendation}
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
