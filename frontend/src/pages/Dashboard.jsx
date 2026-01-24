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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Loan Intelligence Dashboard
        </h1>
        <p className="text-slate-700 mt-2">
          Make optimal loan repayment and prepayment decisions using
          algorithmic analysis.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Repayment Optimizer">
          <p className="mb-4">
            Determine which loan to pay first using a greedy algorithm
            while maintaining cash-flow safety.
          </p>
          <button
            onClick={() => navigate("/repayment")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Optimize Repayment
          </button>
        </Card>

        <Card title="Opportunity Cost Analyzer">
          <p className="mb-4">
            Decide whether to prepay loans or invest surplus cash based
            on expected returns.
          </p>
          <button
            onClick={() => navigate("/opportunity")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Analyze Opportunity
          </button>
        </Card>

        <Card title="Prepayment Timing Optimizer">
          <p className="mb-4">
            Find the best month to make a lump-sum prepayment to maximize
            interest savings.
          </p>
          <button
            onClick={() => navigate("/prepayment")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Optimize Timing
          </button>
        </Card>

        <Card title="Saved Scenarios">
          <p className="text-slate-700">
            Reload previously saved simulations and continue analysis.
          </p>

          <button
            onClick={async () => {
              if (!showSavedScenarios) {
                await fetchSavedScenarios();
              }
              setShowSavedScenarios(prev => !prev);
            }}
            className="mt-4 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition"
          >
            {showSavedScenarios ? "Hide Scenarios" : "Load Saved Scenarios"}
          </button>

          {showSavedScenarios && (
            <div className="mt-4 space-y-3">
              {savedScenarios.length === 0 ? (
                <p className="text-slate-600">No saved scenarios yet.</p>
              ) : (
                savedScenarios.map(s => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between border rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-sm text-slate-600">
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
                        className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
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
                        className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
