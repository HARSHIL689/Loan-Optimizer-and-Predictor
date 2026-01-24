const express = require("express");
const router = express.Router();
const optimizationController = require("../controllers/optimization.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/repayment",
  authMiddleware,
  optimizationController.optimizeRepayment
);

router.post(
  "/opportunity",
  authMiddleware,
  optimizationController.analyzeOpportunity
);

router.post(
  "/prepayment-timing",
  authMiddleware,
  optimizationController.optimizePrepaymentTiming
);

router.get("/_test", (req, res) => {
    res.json({ ok: true });
  });
  

module.exports = router;
