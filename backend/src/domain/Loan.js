const { money } = require("../utils/money");

class Loan {
  constructor({ id, principal, annualRate, minEmi, startMonth = 0 }) {
    this.id = id;

    this.principal = money(principal);
    this.remaining = money(principal);

    this.annualRate = annualRate;
    this.minEmi = money(minEmi);

    this.startMonth = startMonth;
  }

  get monthlyRate() {
    return this.annualRate / 12 / 100;
  }

  isActive(currentMonth) {
    return this.remaining.gt(0) && currentMonth >= this.startMonth;
  }
}

module.exports = Loan;
