const { Decimal } = require("../utils/money");
const pool = require("../config/db");

async function saveScenario({ initialBalance, totalInterest, months }) {
  const result = await pool.query(
    `
    INSERT INTO optimization_scenarios
      (initial_balance, total_interest, months)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [initialBalance, new Decimal(totalInterest).toNumber(), months]
  );

  return result.rows[0].id;
}

async function createScenario({
  user_id,
  name,
  scenario_type,
  input_data,
  result_data,
}) {
  const res = await pool.query(
    `
    INSERT INTO scenarios (user_id, name, scenario_type, input_data, result_data)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, scenario_type, created_at
    `,
    [user_id, name || null, scenario_type, input_data, result_data]
  );
  return res.rows[0];
}

async function listScenariosByUser(userId) {
  const res = await pool.query(
    `
    SELECT id, name, scenario_type, created_at
    FROM scenarios
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );
  return res.rows;
}

async function getScenarioById(id, userId) {
  const res = await pool.query(
    `
    SELECT id, name, scenario_type, input_data, result_data
    FROM scenarios
    WHERE id = $1 AND user_id = $2
    `,
    [id, userId]
  );

  return res.rows[0];
}

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
  saveScenario,
  createScenario,
  listScenariosByUser,
  getScenarioById,
  deleteScenarioById
};
