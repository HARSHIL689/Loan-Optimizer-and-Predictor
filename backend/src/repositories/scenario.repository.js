const pool = require("../config/db");

/**
 * Create a new scenario (no name).
 */
async function createScenario({
  userId,
  scenarioType,
  inputData,
  resultData
}) {
  const res = await pool.query(
    `
    INSERT INTO scenarios (user_id, scenario_type, input_data, result_data)
    VALUES ($1, $2, $3, $4)
    RETURNING id, scenario_type, created_at
    `,
    [userId, scenarioType, inputData, resultData]
  );

  return res.rows[0];
}

/**
 * List all scenarios for a user.
 * Ordering is used later to derive Scenario #1, #2, ...
 */
async function listScenariosByUser(userId) {
  const res = await pool.query(
    `
    SELECT id, scenario_type, created_at
    FROM scenarios
    WHERE user_id = $1
    ORDER BY created_at ASC
    `,
    [userId]
  );

  return res.rows;
}

/**
 * Load a single scenario by id.
 */
async function getScenarioById(id, userId) {
  const res = await pool.query(
    `
    SELECT id, scenario_type, input_data, result_data, created_at
    FROM scenarios
    WHERE id = $1 AND user_id = $2
    `,
    [id, userId]
  );

  return res.rows[0];
}

/**
 * Delete a scenario.
 */
async function deleteScenarioById(id, userId) {
  const res = await pool.query(
    `
    DELETE FROM scenarios
    WHERE id = $1 AND user_id = $2
    RETURNING id
    `,
    [id, userId]
  );

  return res.rows[0];
}

module.exports = {
  createScenario,
  listScenariosByUser,
  getScenarioById,
  deleteScenarioById
};
