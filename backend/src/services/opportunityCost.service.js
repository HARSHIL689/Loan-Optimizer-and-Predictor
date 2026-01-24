const { money } = require("../utils/money");

class OpportunityCostService {
  analyze({
    extraAmount,
    interestSaved,      
    investmentRate,     
    durationMonths
  }) {
    const principal = money(extraAmount);

    const monthlyRate = investmentRate / 12 / 100;

    const futureValue = principal.mul(
      money(1).plus(monthlyRate).pow(durationMonths)
    );

    const investmentGain = futureValue.minus(principal);

    const loanInterestSaved = money(interestSaved);

    const netBenefit = investmentGain.minus(loanInterestSaved);

    let recommendation;
    if (netBenefit.abs().lt(100)) {
      recommendation = "EITHER";
    } else if (netBenefit.gt(0)) {
      recommendation = "INVEST";
    } else {
      recommendation = "PREPAY_LOAN";
    }

    return {
      extraAmount: principal.toString(),
      investmentGain: investmentGain.toString(),
      interestAvoided: loanInterestSaved.toString(),
      netBenefit: netBenefit.toString(),
      recommendation
    };
  }
}

module.exports = OpportunityCostService;
