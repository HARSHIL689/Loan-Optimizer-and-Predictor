const { money } = require("../utils/money");

class SimulationState {
  constructor({ month = 0, balance }) {
    this.month = month;
    this.balance = money(balance);
    this.minBalanceThisMonth = this.balance;
  }

  debit(amount) {
    if (!amount) {
      // Defensive guard – do nothing if invalid
      return;
    }

    this.balance = this.balance.minus(amount);

    if (this.balance.lt(this.minBalanceThisMonth)) {
      this.minBalanceThisMonth = this.balance;
    }
  }

  credit(amount) {
    if (!amount) {
      return;
    }

    this.balance = this.balance.plus(amount);
  }

  resetMonthFloor() {
    this.minBalanceThisMonth = this.balance;
  }
}

module.exports = SimulationState;
