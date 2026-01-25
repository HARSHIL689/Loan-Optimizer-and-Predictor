const scenarioService = require("../services/scenarioService");

async function saveScenario(req, res) {
  try {
    const userId = req.user.id; // from JWT middleware
    const { scenarioType, inputData, resultData } = req.body;

    const saved = await scenarioService.saveScenario({
      userId,
      scenarioType,
      inputData,
      resultData
    });

    return res.status(201).json({
      message: "Scenario saved",
      scenario: saved
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Failed to save scenario"
    });
  }
}

async function listScenarios(req, res) {
  try {
    const userId = req.user.id;
    const scenarios = await scenarioService.getUserScenarios(userId);

    return res.status(200).json({ scenarios });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch scenarios"
    });
  }
}

async function loadScenario(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const scenario = await scenarioService.loadScenario({
      scenarioId: id,
      userId
    });

    return res.status(200).json({ scenario });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Failed to load scenario"
    });
  }
}

async function deleteScenario(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await scenarioService.deleteScenario({
      scenarioId: id,
      userId
    });

    return res.status(200).json({ message: "Scenario deleted" });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      message: err.message || "Failed to delete scenario"
    });
  }
}

module.exports = {
  saveScenario,
  listScenarios,
  loadScenario,
  deleteScenario
};
