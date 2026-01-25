const { money } = require("../utils/money");

class PrepaymentTimingService {
  optimize({
    initialBalance,
    annualRate,
    prepaymentAmount,
    investmentAnnualRate,
    searchMonths,
    monthlyPayment
  }) {
    const loanRate = annualRate / 12 / 100;
    const investRate = investmentAnnualRate / 12 / 100;
  
    let bestMonth = 1;
    let maxNetGain = money(-Infinity);
  
    for (let m = 1; m <= searchMonths; m++) {
      let balance = money(initialBalance);
      let interestPaid = money(0);
  
      // 1️⃣ Simulate loan until month m (no prepayment)
      for (let i = 1; i <= m; i++) {
        const interest = balance.mul(loanRate);
        interestPaid = interestPaid.plus(interest);
        balance = balance.plus(interest).minus(monthlyPayment);
      }
  
      // 2️⃣ Apply prepayment
      balance = balance.minus(prepaymentAmount);
      if (balance.lt(0)) balance = money(0);
  
      // 3️⃣ Investment growth of lump sum till month m
      let invested = money(prepaymentAmount);
      for (let i = 1; i <= m; i++) {
        invested = invested.plus(invested.mul(investRate));
      }
  
      const investmentGain = invested.minus(prepaymentAmount);
      const netGain = investmentGain.minus(interestPaid);
  
      if (netGain.gt(maxNetGain)) {
        maxNetGain = netGain;
        bestMonth = m;
      }
    }
  
    return {
      bestMonth,
      maxInterestSaved: maxNetGain.toString(),
      evaluatedMonths: searchMonths
    };
  }  
}

module.exports = PrepaymentTimingService;
