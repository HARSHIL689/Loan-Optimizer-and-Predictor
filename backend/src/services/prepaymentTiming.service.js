const { money } = require("../utils/money");

class PrepaymentTimingService {
  optimize({
    initialBalance,
    annualRate,
    prepaymentAmount,
    searchMonths = 24
  }) {
    const monthlyRate = annualRate / 12 / 100;
    const principal = money(initialBalance);
    const lumpSum = money(prepaymentAmount);

    let bestMonth = 0;
    let maxInterestSaved = money(0);

    // 1️ Baseline: no prepayment
    let baselineBalance = principal;
    let baselineInterest = money(0);

    for (let m = 1; m <= searchMonths; m++) {
      const interest = baselineBalance.mul(monthlyRate);
      baselineInterest = baselineInterest.plus(interest);
      baselineBalance = baselineBalance.plus(interest);
    }

    // 2️ Try prepayment at each month
    for (let prepayMonth = 1; prepayMonth <= searchMonths; prepayMonth++) {
      let balance = principal;
      let totalInterest = money(0);

      for (let m = 1; m <= searchMonths; m++) {
        const interest = balance.mul(monthlyRate);
        totalInterest = totalInterest.plus(interest);
        balance = balance.plus(interest);

        // Apply lump sum at selected month
        if (m === prepayMonth) {
          balance = balance.minus(lumpSum);
          if (balance.lt(0)) balance = money(0);
        }
      }

      const interestSaved = baselineInterest.minus(totalInterest);

      if (interestSaved.gt(maxInterestSaved)) {
        maxInterestSaved = interestSaved;
        bestMonth = prepayMonth;
      }
    }

    return {
      bestMonth,
      maxInterestSaved: maxInterestSaved.toString(),
      evaluatedMonths: searchMonths
    };
  }
}

module.exports = PrepaymentTimingService;
