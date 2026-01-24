const { money } = require("../utils/money");

class CashFlow {
  constructor({ monthlyIncome, monthlyExpenses, safeBalance }) {
    this.monthlyIncome = money(monthlyIncome);
    this.monthlyExpenses = money(monthlyExpenses);
    this.safeBalance = money(safeBalance);
  }

  availableForLoans() {
    return this.monthlyIncome.minus(this.monthlyExpenses);
  }
}

module.exports = CashFlow;
