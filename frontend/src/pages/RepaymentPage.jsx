import { useState } from "react";
import { optimizeRepayment } from "../api/optimizer.api";
import { useScenario } from "../context/ScenarioContext";

import LoanForm from "../components/LoanForm";
import CashFlowForm from "../components/CashFlowForm";
import ResultCard from "../components/ResultCard";
import SafetyIndicator from "../components/SafetyIndicator";
import Card from "../components/Card";
import AlertModal from "../components/AlertModal";

function computeSafety(result, safeBalance) {
  if (!result) return null;

  let min = Infinity;
  for (const s of result.snapshots) {
    min = Math.min(min, Number(s.minBalance));
  }

  return {
    overallMinBalance: min,
    isUnsafe: min < safeBalance
  };
}

export default function RepaymentPage() {
  const {
    scenario,
    setScenario,
    resetScenario,
    saveCurrentScenario
  } = useScenario();

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const result = scenario.repaymentResult;

  async function handleRun() {
    if (
      !scenario.initialBalance ||
      !scenario.cashFlow.monthlyIncome ||
      !scenario.cashFlow.monthlyExpenses ||
      !scenario.cashFlow.safeBalance ||
      scenario.loans.length === 0
    ) {
      setAlertMessage("Please fill all fields before running optimization.");
      return;
    }

    for (const loan of scenario.loans) {
      if (!loan.principal || !loan.annualRate || !loan.minEmi) {
        setAlertMessage("Please fill all loan fields before running optimization.");
        return;
      }
    }

    setLoading(true);

    try {
      const data = await optimizeRepayment({
        loans: scenario.loans.map(l => ({
          id: l.id,
          principal: Number(l.principal),
          annualRate: Number(l.annualRate),
          minEmi: Number(l.minEmi)
        })),
        cashFlow: {
          monthlyIncome: Number(scenario.cashFlow.monthlyIncome),
          monthlyExpenses: Number(scenario.cashFlow.monthlyExpenses),
          safeBalance: Number(scenario.cashFlow.safeBalance)
        },
        initialBalance: Number(scenario.initialBalance)
      });

      setScenario(prev => ({
        ...prev,
        repaymentResult: data
      }));
    } catch (err) {
      setAlertMessage(err.message || "Failed to run optimization.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveScenario() {
    if (!result) {
      setAlertMessage("Run the optimizer before saving.");
      return;
    }

    try {
      await saveCurrentScenario({ scenarioType: "repayment" });
      setAlertMessage("Scenario saved successfully.");
    } catch (err) {
      setAlertMessage(err.message || "Failed to save scenario.");
    }
  }

  const safety = result
    ? computeSafety(result, scenario.cashFlow.safeBalance)
    : null;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold tracking-wide text-ink border-b border-brass/40 pb-4">
        Repayment Optimizer
      </h1>

      <Card title="Cash Flow">
        <CashFlowForm
          cashFlow={scenario.cashFlow}
          initialBalance={scenario.initialBalance}
          onBalanceChange={v =>
            setScenario(s => ({ ...s, initialBalance: v }))
          }
          onChange={(field, value) =>
            setScenario(s => ({
              ...s,
              cashFlow: { ...s.cashFlow, [field]: value }
            }))
          }
        />
      </Card>

      <Card title="Loans">
        <LoanForm
          loans={scenario.loans}
          onUpdate={(index, field, value) =>
            setScenario(s => {
              const updated = [...s.loans];
              updated[index] = { ...updated[index], [field]: value };
              return { ...s, loans: updated };
            })
          }
          onAdd={() =>
            setScenario(s => ({
              ...s,
              loans: [
                ...s.loans,
                {
                  id: `L${s.loans.length + 1}`,
                  principal: "",
                  annualRate: "",
                  minEmi: ""
                }
              ]
            }))
          }
        />
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleRun}
          disabled={loading}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition disabled:opacity-50"
        >
          {loading ? "Casting Optimization Spell..." : "Run Optimization"}
        </button>

        <button
          onClick={resetScenario}
          type="button"
          className="ml-auto bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition"
        >
          Reset all inputs
        </button>
      </div>

      <ResultCard result={result} />

      <button
        onClick={handleSaveScenario}
        disabled={!result}
        className="bg-primary text-white w-full px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition disabled:opacity-50"
      >
        Save Scenario
      </button>

      <SafetyIndicator
        safety={safety}
        safeBalance={scenario.cashFlow.safeBalance}
      />

      <AlertModal
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
    </div>
  );
}
