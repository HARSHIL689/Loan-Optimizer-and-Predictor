import { useEffect, useState } from "react";
import { useScenario } from "../context/ScenarioContext";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    savedScenarios,
    fetchSavedScenarios,
    loadSavedScenario,
    deleteSavedScenario
  } = useScenario();

  const [showSavedScenarios, setShowSavedScenarios] = useState(false);

  useEffect(() => {
    fetchSavedScenarios();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-brass/40 pb-6">
        <h1 className="text-4xl font-extrabold tracking-wide text-ink">
          Loan Intelligence Dashboard
        </h1>
        <p className="mt-3 text-ink/70 max-w-3xl">
          Make optimal loan repayment and prepayment decisions using
          algorithmic analysis and disciplined financial magic.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Repayment Optimizer">
          <p className="mb-5 text-ink/80 leading-relaxed">
            Determine which loan to pay first using a greedy algorithm
            while maintaining cash-flow safety.
          </p>
          <button
            onClick={() => navigate("/repayment")}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:brightness-110 active:scale-[0.97] transition"
          >
            Optimize Repayment
          </button>
        </Card>

        <Card title="Opportunity Cost Analyzer">
          <p className="mb-5 text-ink/80 leading-relaxed">
            Decide whether to prepay loans or invest surplus cash based
            on expected returns.
          </p>
          <button
            onClick={() => navigate("/opportunity")}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:brightness-110 active:scale-[0.97] transition"
          >
            Analyze Opportunity
          </button>
        </Card>

        <Card title="Prepayment Timing Optimizer" >
          <p className="mb-5 text-ink/80 leading-relaxed">
            Find the best month to make a lump-sum prepayment to maximize
            interest savings.
          </p>
          <button
            onClick={() => navigate("/prepayment")}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:brightness-110 active:scale-[0.97] transition"
          >
            Optimize Timing
          </button>
        </Card>

        {/* <Card title="Saved Scenarios">
          <p className="mb-5 text-ink/80 leading-relaxed">
            Reload previously saved simulations and continue analysis.
          </p>

          <button
            onClick={async () => {
              if (!showSavedScenarios) {
                await fetchSavedScenarios();
              }
              setShowSavedScenarios(prev => !prev);
            }}
            className="bg-brass text-midnight px-5 py-2.5 rounded-xl font-semibold shadow-md hover:brightness-105 transition"
          >
            {showSavedScenarios ? "Hide Scenarios" : "Load Saved Scenarios"}
          </button>

          {showSavedScenarios && (
            <div className="mt-6 space-y-4">
              {savedScenarios.length === 0 ? (
                <p className="text-ink/70 italic">
                  No saved scenarios yet.
                </p>
              ) : (
                savedScenarios.map(s => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-brass/40 bg-parchment px-4 py-3 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-ink">{s.name}</p>
                      <p className="text-sm text-ink/60">
                        {s.scenario_type} •{" "}
                        {new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const type = await loadSavedScenario(s.id);

                          if (type === "repayment") navigate("/repayment");
                          if (type === "opportunity") navigate("/opportunity");
                          if (type === "prepayment") navigate("/prepayment");
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg bg-primary text-white hover:brightness-110 transition"
                      >
                        Load
                      </button>

                      <button
                        onClick={async () => {
                          const confirmed = window.confirm(
                            "Are you sure you want to delete this scenario?"
                          );
                          if (!confirmed) return;

                          await deleteSavedScenario(s.id);
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card> */}
      </div>
    </div>
  );
}
