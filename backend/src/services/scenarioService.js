const {
  createScenario,
  listScenariosByUser,
  getScenarioById,
  deleteScenarioById
} = require("../repositories/scenario.repository");

async function saveScenario({
  userId,
  name,
  scenarioType,
  inputData,
  resultData,
}) {
  if (!scenarioType || !inputData || !resultData) {
    const err = new Error("Missing required scenario fields");
    err.statusCode = 400;
    throw err;
  }

  return createScenario({
    user_id: userId,                // ✅ FIX
    name: name || null,
    scenario_type: scenarioType,    // ✅ FIX
    input_data: inputData,          // ✅ FIX
    result_data: resultData 
  });
}

async function getUserScenarios(userId) {
  return listScenariosByUser(userId);
}

async function loadScenario({ scenarioId, userId }) {
  const scenario = await getScenarioById(scenarioId, userId);

  if (!scenario) {
    const err = new Error("Scenario not found");
    err.statusCode = 404;
    throw err;
  }

  return scenario;
}

async function deleteScenario({ scenarioId, userId }) {
  const deleted = await deleteScenarioById(scenarioId, userId);

  if (!deleted) {
    const err = new Error("Scenario not found");
    err.statusCode = 404;
    throw err;
  }

  return deleted;
}

module.exports = {
  saveScenario,
  getUserScenarios,
  loadScenario,
  deleteScenario
};
