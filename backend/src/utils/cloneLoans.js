const Loan = require("../domain/Loan");

function cloneLoans(loans) {
  return loans.map(
    l =>
      new Loan({
        id: l.id,
        principal: l.remaining.toString(),
        annualRate: l.annualRate,
        minEmi: l.minEmi.toString(),
        startMonth: l.startMonth
      })
  );
}

module.exports = cloneLoans;
