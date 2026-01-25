import { useState } from "react";
import { optimizeRepayment } from "../api/optimizer.api";
import { analyzeOpportunity } from "../api/optimizer.api";
import { optimizePrepaymentTiming } from "../api/optimizer.api";

export default function LoanOptimizerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [extraAmount, setExtraAmount] = useState(20000);
  const [investmentRate, setInvestmentRate] = useState(10);
  const [durationMonths, setDurationMonths] = useState(24);

  const [opportunityResult, setOpportunityResult] = useState(null);
  const [opportunityError, setOpportunityError] = useState(null);
  const [opportunityLoading, setOpportunityLoading] = useState(false);

  const [prepaymentAmount, setPrepaymentAmount] = useState(25000);
  const [searchMonths, setSearchMonths] = useState(12);

  const [prepaymentResult, setPrepaymentResult] = useState(null);
  const [prepaymentError, setPrepaymentError] = useState(null);
  const [prepaymentLoading, setPrepaymentLoading] = useState(false);

  const [initialBalance, setInitialBalance] = useState(50000);

  const [cashFlow, setCashFlow] = useState({
    monthlyIncome: 60000,
    monthlyExpenses: 30000,
    safeBalance: 10000
  });

  const [loans, setLoans] = useState([
    { id: "L1", principal: 200000, annualRate: 12, minEmi: 5000 },
    { id: "L2", principal: 100000, annualRate: 15, minEmi: 3000 }
  ]);

  async function handleRun() {
    setLoading(true);
    setError(null);

    try {
      const payload = { initialBalance, cashFlow, loans };
      const data = await optimizeRepayment(payload);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleOpportunityAnalysis() {
    if (!result) {
      setOpportunityError("Run repayment optimization first.");
      return;
    }

    setOpportunityLoading(true);
    setOpportunityError(null);

    try {
      const payload = {
        extraAmount,
        interestSaved: result.totalInterestPaid,
        investmentRate,
        durationMonths
      };

      const data = await analyzeOpportunity(payload);
      setOpportunityResult(data);
    } catch (err) {
      setOpportunityError(err.message);
    } finally {
      setOpportunityLoading(false);
    }
  }

  async function handlePrepaymentTiming() {
    if (!result) {
      setPrepaymentError("Run repayment optimization first.");
      return;
    }

    setPrepaymentLoading(true);
    setPrepaymentError(null);

    try {
      const payload = {
        initialBalance,
        prepaymentAmount,
        searchMonths,
        cashFlow,
        loans
      };

      const data = await optimizePrepaymentTiming(payload);
      setPrepaymentResult(data);
    } catch (err) {
      setPrepaymentError(err.message);
    } finally {
      setPrepaymentLoading(false);
    }
  }

  function computeSafety(result, safeBalance) {
    if (!result || !result.snapshots) return null;

    let min = Infinity;
    for (const snap of result.snapshots) {
      min = Math.min(min, Number(snap.minBalance));
    }

    return {
      overallMinBalance: min,
      isUnsafe: min < safeBalance
    };
  }

  const safety = result ? computeSafety(result, cashFlow.safeBalance) : null;

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-6 py-8 text-ink">
      <h1 className="text-4xl font-extrabold tracking-wide border-b border-brass/40 pb-4">
        Loan Repayment Optimizer
      </h1>

      {/* Cash Flow */}
      <div className="rounded-2xl bg-parchment border border-brass/40 p-6 space-y-4 shadow-lg">
        <h3 className="text-xl font-bold">Cash Flow</h3>

        <input className="wizard-input" type="number" value={initialBalance}
          onChange={e => setInitialBalance(Number(e.target.value))}
          placeholder="Initial Balance" />

        <input className="wizard-input" type="number" value={cashFlow.monthlyIncome}
          onChange={e => setCashFlow({ ...cashFlow, monthlyIncome: Number(e.target.value) })}
          placeholder="Monthly Income" />

        <input className="wizard-input" type="number" value={cashFlow.monthlyExpenses}
          onChange={e => setCashFlow({ ...cashFlow, monthlyExpenses: Number(e.target.value) })}
          placeholder="Monthly Expenses" />

        <input className="wizard-input" type="number" value={cashFlow.safeBalance}
          onChange={e => setCashFlow({ ...cashFlow, safeBalance: Number(e.target.value) })}
          placeholder="Safe Balance" />
      </div>

      {/* Loans */}
      <div className="rounded-2xl bg-parchment border border-brass/40 p-6 space-y-4 shadow-lg">
        <h3 className="text-xl font-bold">Loans</h3>

        {loans.map((loan, index) => (
          <div key={index} className="grid md:grid-cols-4 gap-4 p-4 border border-brass/30 rounded-xl">
            <input className="wizard-input" value={loan.id}
              onChange={e => setLoans(loans.map((l,i)=>i===index?{...l,id:e.target.value}:l))}
              placeholder="Loan ID" />

            <input className="wizard-input" type="number" value={loan.principal}
              onChange={e => setLoans(loans.map((l,i)=>i===index?{...l,principal:Number(e.target.value)}:l))}
              placeholder="Principal" />

            <input className="wizard-input" type="number" value={loan.annualRate}
              onChange={e => setLoans(loans.map((l,i)=>i===index?{...l,annualRate:Number(e.target.value)}:l))}
              placeholder="Annual Rate (%)" />

            <input className="wizard-input" type="number" value={loan.minEmi}
              onChange={e => setLoans(loans.map((l,i)=>i===index?{...l,minEmi:Number(e.target.value)}:l))}
              placeholder="Min EMI" />
          </div>
        ))}

        <button
          onClick={() =>
            setLoans([...loans, { id:`L${loans.length+1}`, principal:0, annualRate:0, minEmi:0 }])
          }
          className="text-primary font-semibold hover:underline"
        >
          + Add Loan
        </button>
      </div>

      <button
        onClick={handleRun}
        disabled={loading}
        className="wizard-primary-btn"
      >
        {loading ? "Casting Optimization Spell..." : "Run Optimization"}
      </button>

      {error && <p className="text-red-700 font-semibold">{error}</p>}

      {result && (
        <div className="rounded-2xl bg-parchment border border-brass/40 p-6 shadow-lg space-y-2">
          <h3 className="text-xl font-bold">Result</h3>
          <p>Months to Debt-Free: <strong>{result.months}</strong></p>
          <p>Total Interest Paid: <strong>{result.totalInterestPaid}</strong></p>
        </div>
      )}
    </div>
  );
}
