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
      balance: initialBalance
    });

    const snapshots = [];
    let totalInterestPaid = money(0);

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
      state.minBalanceThisMonth = state.balance;
      state.credit(cashFlow.monthlyIncome);
      state.debit(cashFlow.monthlyExpenses);
      
      const activeLoans = loans.filter(l => l.remaining.gt(0));

      for (const loan of activeLoans) {
        const interest = loan.remaining.mul(loan.monthlyRate);
        loan.remaining = loan.remaining.plus(interest);
        totalInterestPaid = totalInterestPaid.plus(interest);
      }

      for (const loan of activeLoans) {
        const emi = Decimal.min(loan.minEmi, loan.remaining);
        state.debit(emi);
        loan.remaining = loan.remaining.minus(emi);
      }

      if (prepayment && prepayment.month === state.month) {
        const targetLoan = activeLoans
          .filter(l => l.remaining.gt(0))
          .sort((a, b) => b.annualRate - a.annualRate)[0];
    
        if (targetLoan) {
          const available = state.balance.minus(cashFlow.safeBalance);
          if (available.gt(0)) {
            const amount = Decimal.min(
              money(prepayment.amount),
              available,
              targetLoan.remaining
            );
            state.debit(amount);
            targetLoan.remaining = targetLoan.remaining.minus(amount);
          }
        }
      }

      let availableForPrepay = state.balance.minus(cashFlow.safeBalance);

      if (availableForPrepay.gt(0)) {
        const targetLoan = activeLoans
          .filter(l => l.remaining.gt(0))
          .sort((a, b) => b.annualRate - a.annualRate)[0];
    
        if (targetLoan) {
          const payment = Decimal.min(
            availableForPrepay,
            targetLoan.remaining
          );
          state.debit(payment);
          targetLoan.remaining = targetLoan.remaining.minus(payment);
        }
      }

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
