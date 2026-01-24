const { money } = require("../utils/money");

class OpportunityCostService {
  analyze({
    extraAmount,
    interestSaved,    
    investmentRate,     
    durationMonths
  }) {
    const principal = money(extraAmount);

    //  Loan prepayment savings (SIMPLE interest approximation)
    const loanRateAnnual = interestSaved / 100;
    const loanInterestSaved = principal.mul(
      loanRateAnnual * (durationMonths / 12)
    );

    //  Investment gain (COMPOUND monthly)
    const monthlyInvestmentRate = investmentRate / 12 / 100;

    const futureValue = principal.mul(
      money(1).plus(monthlyInvestmentRate).pow(durationMonths)
    );

    const investmentGain = futureValue.minus(principal);

    // Net benefit
    const netBenefit = investmentGain.minus(loanInterestSaved);

    // Recommendation logic (with tolerance)
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
