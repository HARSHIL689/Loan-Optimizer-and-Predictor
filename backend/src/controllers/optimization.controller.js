const RepaymentOptimizerService = require("../services/repaymentOptimizer.service");
const OpportunityCostService = require("../services/opportunityCost.service");
const PrepaymentTimingService = require("../services/prepaymentTiming.service");
const Loan = require("../domain/Loan");
const CashFlow = require("../domain/CashFlow");
const { saveLoans } = require("../repositories/loan.repository");
const { createScenario } = require("../repositories/scenario.repository");
const {
  validateLoans,
  validateNumber
} = require("../validators/optimization.validator");
const scenarioService = require("../services/scenarioService");

class OptimizationController {
  async optimizeRepayment(req, res) {
    try {
      console.log("REQ.USER IN CONTROLLER:", req.user);

      const { loans, cashFlow, initialBalance, name } = req.body;
  
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
      console.log("USER ID PASSED TO DB:", req.user?.id);

      await scenarioService.saveScenario({
        userId: req.user.id,
        name: name || null,
        scenarioType: "repayment",
        inputData: {
          loans,
          cashFlow,
          initialBalance
        },
        resultData: result
      });
  
      res.json(result);
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
          annualRate,
          initialBalance,
          prepaymentAmount,
          searchMonths
        } = req.body;
    
        validateNumber(initialBalance, "initialBalance");
        validateNumber(annualRate, "annualRate");
        validateNumber(prepaymentAmount, "prepaymentAmount");
        validateNumber(searchMonths, "searchMonths");
    
        const service = new PrepaymentTimingService();
        const result = service.optimize({
          annualRate,
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
