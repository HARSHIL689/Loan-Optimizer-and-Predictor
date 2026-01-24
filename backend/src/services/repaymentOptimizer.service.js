const SimulationState = require("../domain/SimulationState");
const { money, Decimal } = require("../utils/money");

class RepaymentOptimizerService {
  runSimulation({
    loans,
    cashFlow,
    initialBalance,
    maxMonths = 600,
    prepayment = null
  }) {
    const state = new SimulationState({
      month: 0,
      balance: money(initialBalance)
    });

    const snapshots = [];
    let totalInterestPaid = money(0);

    // Pre-calc monthly surplus
    const monthlySurplus = cashFlow.monthlyIncome.minus(
      cashFlow.monthlyExpenses
    );

    const mandatoryEmi = loans.reduce(
      (sum, l) => sum.plus(l.minEmi),
      money(0)
    );

    if (monthlySurplus.lte(mandatoryEmi)) {
      throw new Error("Monthly surplus is insufficient to cover EMIs");
    }

    while (
      state.month < maxMonths &&
      loans.some(l => l.remaining.gt(0))
    ) {
      state.credit(cashFlow.monthlyIncome);
      state.debit(cashFlow.monthlyExpenses);

      const activeLoans = loans.filter(l => l.remaining.gt(0));

      // 1️ Apply interest FIRST
      for (const loan of activeLoans) {
        const interest = loan.remaining.mul(loan.monthlyRate);
        loan.remaining = loan.remaining.plus(interest);
        totalInterestPaid = totalInterestPaid.plus(interest);
      }

      // Sort once per month (debt avalanche)
      activeLoans.sort((a, b) => b.annualRate - a.annualRate);

      // 2️ Apply EMI
      for (const loan of activeLoans) {
        if (loan.remaining.lte(0)) continue;

        const emi = Decimal.min(loan.minEmi, loan.remaining);
        state.debit(emi);
        loan.remaining = loan.remaining.minus(emi);
      }

      // 3️ Optional lump-sum prepayment
      if (prepayment && prepayment.month === state.month) {
        const targetLoan = activeLoans.find(l => l.remaining.gt(0));
        if (targetLoan) {
          const amount = Decimal.min(
            money(prepayment.amount),
            targetLoan.remaining
          );
          state.debit(amount);
          targetLoan.remaining = targetLoan.remaining.minus(amount);
        }
      }

      // 4️ Apply extra surplus (greedy)
      let extra = monthlySurplus.minus(mandatoryEmi);

      for (const loan of activeLoans) {
        if (extra.lte(0)) break;
        if (loan.remaining.lte(0)) continue;

        const payment = Decimal.min(extra, loan.remaining);
        state.debit(payment);
        loan.remaining = loan.remaining.minus(payment);
        extra = extra.minus(payment);
      }

      // 5️ Normalize tiny balances
      for (const loan of activeLoans) {
        if (loan.remaining.lt(1)) {
          loan.remaining = money(0);
        }
      }

      snapshots.push({
        month: state.month,
        balance: state.balance.toString(),
        minBalance: state.minBalanceThisMonth.toString(),
        loans: activeLoans.map(l => ({
          id: l.id,
          remaining: l.remaining.toString()
        }))
      });

      state.month++;
    }

    if (state.month >= maxMonths) {
      throw new Error("Repayment did not converge within max months");
    }

    return {
      months: state.month,
      totalInterestPaid: totalInterestPaid.toString(),
      snapshots
    };
  }
}

module.exports = RepaymentOptimizerService;
