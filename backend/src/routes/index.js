const express = require("express");
const router = express.Router();
const optimizationController = require("../controllers/optimization.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

router.post(
  "/optimize/repayment",
  authMiddleware,
  optimizationController.optimizeRepayment
);

router.post(
  "/optimize/opportunity",
  authMiddleware,
  optimizationController.analyzeOpportunity
);

router.post(
  "/optimize/prepayment-timing",
  authMiddleware,
  optimizationController.optimizePrepaymentTiming
);

module.exports = router;
