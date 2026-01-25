import { createContext, useContext, useState } from "react";
import {
  saveScenario,
  listScenarios,
  loadScenario as loadScenarioApi,
  deleteScenario as deleteScenarioApi
} from "../api/scenario.api";

const ScenarioContext = createContext();

export function ScenarioProvider({ children }) {
  const [scenario, setScenario] = useState({
    initialBalance: "",
    cashFlow: { monthlyIncome: "", monthlyExpenses: "", safeBalance: "" },
    loans: [],
    extraAmount: "",
    interestSaved: "",
    investmentRate: "",
    durationMonths: "",
    prepaymentAmount: "",
    prepaymentAnnualRate: "",
    searchMonths: "",
    repaymentResult: null,
    opportunityResult: null,
    prepaymentResult: null
  });

  const [savedScenarios, setSavedScenarios] = useState([]);

  function resetScenario() {
    setScenario({
      initialBalance: "",
      cashFlow: {
        monthlyIncome: "",
        monthlyExpenses: "",
        safeBalance: ""
      },
      loans: [],
      extraAmount: "",
      interestSaved: "",
      investmentRate: "",
      durationMonths: "",
      prepaymentAmount: "",
      prepaymentAnnualRate: "",
      searchMonths: "",
      repaymentResult: null,
      opportunityResult: null,
      prepaymentResult: null
    });
  }

  /**
   * Save scenario WITHOUT name.
   * Scenario will be identified later by number (order / id).
   */
  async function saveCurrentScenario({ scenarioType }) {
    if (!scenarioType) {
      throw new Error("scenarioType is required");
    }

    const inputData = {
      initialBalance: scenario.initialBalance,
      cashFlow: scenario.cashFlow,
      loans: scenario.loans,
      extraAmount: scenario.extraAmount,
      interestSaved: scenario.interestSaved,
      investmentRate: scenario.investmentRate,
      durationMonths: scenario.durationMonths,
      prepaymentAmount: scenario.prepaymentAmount,
      searchMonths: scenario.searchMonths
    };

    let resultData = null;

    if (scenarioType === "repayment") {
      resultData = scenario.repaymentResult;
    } else if (scenarioType === "opportunity") {
      resultData = scenario.opportunityResult;
    } else if (scenarioType === "prepayment") {
      resultData = scenario.prepaymentResult;
    }

    if (!resultData) {
      throw new Error("No result to save");
    }

    return saveScenario({
      scenarioType,
      inputData,
      resultData
    });
  }

  async function fetchSavedScenarios() {
    const res = await listScenarios();
    setSavedScenarios(res.scenarios);
  }

  async function loadSavedScenario(scenarioId) {
    const res = await loadScenarioApi(scenarioId);
    const { scenario: saved } = res;

    setScenario({
      initialBalance: saved.input_data.initialBalance ?? "",
      cashFlow: saved.input_data.cashFlow ?? {
        monthlyIncome: "",
        monthlyExpenses: "",
        safeBalance: ""
      },
      loans: saved.input_data.loans ?? [],
      extraAmount: saved.input_data.extraAmount ?? "",
      interestSaved: saved.input_data.interestSaved ?? "",
      investmentRate: saved.input_data.investmentRate ?? "",
      durationMonths: saved.input_data.durationMonths ?? "",
      prepaymentAmount: saved.input_data.prepaymentAmount ?? "",
      searchMonths: saved.input_data.searchMonths ?? "",

      repaymentResult:
        saved.scenario_type === "repayment"
          ? saved.result_data
          : null,

      opportunityResult:
        saved.scenario_type === "opportunity"
          ? saved.result_data
          : null,

      prepaymentResult:
        saved.scenario_type === "prepayment"
          ? saved.result_data
          : null
    });

    return saved.scenario_type;
  }

  async function deleteSavedScenario(id) {
    await deleteScenarioApi(id);
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  }

  return (
    <ScenarioContext.Provider
      value={{
        scenario,
        setScenario,
        resetScenario,
        savedScenarios,
        fetchSavedScenarios,
        saveCurrentScenario,
        loadSavedScenario,
        deleteSavedScenario
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  return useContext(ScenarioContext);
}
