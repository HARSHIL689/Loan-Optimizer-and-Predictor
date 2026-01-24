const express = require("express");
const router = express.Router();

const optimizationRoutes = require("./optimization.routes");

router.use("/optimize", optimizationRoutes);

module.exports = router;
