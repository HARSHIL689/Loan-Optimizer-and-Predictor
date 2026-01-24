const RepaymentOptimizerService = require("../services/repaymentOptimizer.service");
const OpportunityCostService = require("../services/opportunityCost.service");
const PrepaymentTimingService = require("../services/prepaymentTiming.service");
const Loan = require("../domain/Loan");
const CashFlow = require("../domain/CashFlow");
const { saveLoans } = require("../repositories/loan.repository");
const { saveScenario } = require("../repositories/scenario.repository");

const {
  validateLoans,
  validateNumber
} = require("../validators/optimization.validator");

class OptimizationController {
  async optimizeRepayment(req, res) {
    try {
        const { loans, cashFlow, initialBalance } = req.body;
    
        validateLoans(loans);
        validateNumber(initialBalance, "initialBalance");
    
        const loanObjects = loans.map(l => new Loan(l));
    
        const cashFlowObj = new CashFlow(cashFlow);
    
        const optimizer = new RepaymentOptimizerService();
        const result = optimizer.runSimulation({
          loans: loanObjects,
          cashFlow: cashFlowObj,
          initialBalance
        });
        await saveLoans(loanObjects);

        const scenarioId = await saveScenario({
            initialBalance,
            totalInterest: result.totalInterestPaid,
            months: result.months
        });

        res.json({
            scenarioId,
            ...result
        });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
  }
  async analyzeOpportunity(req, res) {
    try {
        const {
          extraAmount,
          interestSaved,
          investmentRate,
          durationMonths
        } = req.body;
    
        validateNumber(extraAmount, "extraAmount");
        validateNumber(investmentRate, "investmentRate");
        validateNumber(durationMonths, "durationMonths");
    
        const service = new OpportunityCostService();
        const result = service.analyze({
          extraAmount,
          interestSaved,
          investmentRate,
          durationMonths
        });
    
        res.json(result);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
  }
  async optimizePrepaymentTiming(req, res) {
    try {
        const {
          loans,
          cashFlow,
          initialBalance,
          prepaymentAmount,
          searchMonths
        } = req.body;
    
        validateLoans(loans);
        validateNumber(prepaymentAmount, "prepaymentAmount");
    
        const loanObjects = loans.map(l => new Loan(l));
        const cashFlowObj = new CashFlow(cashFlow);
    
        const service = new PrepaymentTimingService();
        const result = service.optimize({
          loans: loanObjects,
          cashFlow: cashFlowObj,
          initialBalance,
          prepaymentAmount,
          searchMonths
        });
    
        res.json(result);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
  }

}

module.exports = new OptimizationController();
