import { useState } from "react";
import { optimizePrepaymentTiming } from "../api/optimizer.api";
import Card from "../components/Card";
import InputField from "../components/InputField";
import MetricCard from "../components/MetricCard";
import { formatNumber } from "../utils/formatNumber";
import { useScenario } from "../context/ScenarioContext";
import AlertModal from "../components/AlertModal";

export default function PrepaymentPage() {
  const {
    scenario,
    setScenario,
    resetScenario,
    saveCurrentScenario
  } = useScenario();

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const result = scenario.prepaymentResult;
  const isEmpty = v =>
    v === undefined || v === null || v === "" || Number.isNaN(Number(v));  

  async function handleOptimize() {
    console.log("PREPAYMENT STATE", scenario);
    console.log({
        initialBalance: isEmpty(scenario.initialBalance),
        prepaymentAmount: isEmpty(scenario.prepaymentAmount),
        searchMonths: isEmpty(scenario.searchMonths),
        prepaymentAnnualRate: isEmpty(scenario.prepaymentAnnualRate),
        investmentAnnualRate: isEmpty(scenario.investmentAnnualRate),
        prepaymentMonthlyEmi: isEmpty(scenario.prepaymentMonthlyEmi),
      });
    if (
      isEmpty(scenario.initialBalance) ||
      isEmpty(scenario.prepaymentAmount) ||
      isEmpty(scenario.searchMonths) ||
      isEmpty(scenario.prepaymentAnnualRate) ||
      isEmpty(scenario.investmentAnnualRate) ||
      isEmpty(scenario.prepaymentMonthlyEmi)
    ) {
      setAlertMessage(
        "Please fill all fields before optimizing prepayment timing."
      );
      return;
    }

    setLoading(true);

    try {
      const data = await optimizePrepaymentTiming({
        initialBalance: Number(scenario.initialBalance),
        annualRate: Number(scenario.prepaymentAnnualRate),
        investmentAnnualRate: Number(scenario.investmentAnnualRate),
        prepaymentAmount: Number(scenario.prepaymentAmount),
        searchMonths: Number(scenario.searchMonths),
        monthlyPayment: Number(scenario.prepaymentMonthlyEmi),
      });

      setScenario(s => ({
        ...s,
        prepaymentResult: data
      }));
    } catch (err) {
      setAlertMessage(err.message || "Failed to optimize prepayment timing.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveScenario() {
    if (!result) {
      setAlertMessage("Run the optimization before saving.");
      return;
    }

    try {
      await saveCurrentScenario({ scenarioType: "prepayment" });
      setAlertMessage("Scenario saved successfully.");
    } catch (err) {
      setAlertMessage(err.message || "Failed to save scenario.");
    }
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
            label="Monthly EMI"
            value={scenario.prepaymentMonthlyEmi}
            onChange={v =>
                setScenario(s => ({ ...s, prepaymentMonthlyEmi: v }))
            }
            />
          
          <InputField
            label="Expected Investment Return (%)"
            value={scenario.investmentAnnualRate}
            onChange={v =>
              setScenario(s => ({ ...s, investmentAnnualRate: v }))
            }
            step="0.01"
          />

          <InputField
            label="Loan Interest Rate (%)"
            value={scenario.prepaymentAnnualRate}
            onChange={v =>
              setScenario(s => ({ ...s, prepaymentAnnualRate: v }))
            }
            step="0.01"
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
        <>
          <Card title="Divination Result">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard
                label="Best Month"
                value={`Month ${result.bestMonth}`}
              />
              <MetricCard
                label="Net Financial Benefit"
                value={`₹ ${formatNumber(result.maxInterestSaved, 2)}`}
              />
            </div>
          </Card>

          <button
            onClick={handleSaveScenario}
            className="bg-primary text-white w-full px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition"
          >
            Save Scenario
          </button>
        </>
      )}

      <AlertModal
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
    </div>
  );
}
