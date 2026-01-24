const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const scenarioController = require("../controllers/scenarioController");

router.use(authMiddleware);

router.post("/", scenarioController.saveScenario);
router.get("/", scenarioController.listScenarios);
router.get("/:id", scenarioController.loadScenario)
router.delete("/:id", scenarioController.deleteScenario);

module.exports = router;
