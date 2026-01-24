const pool = require("../config/db");

async function saveLoans(loans) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const loan of loans) {
      await client.query(
        `
        INSERT INTO loans (id, principal, annual_rate, min_emi)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE
        SET principal = EXCLUDED.principal,
            annual_rate = EXCLUDED.annual_rate,
            min_emi = EXCLUDED.min_emi
        `,
        [
          loan.id,
          loan.principal.toString(),
          loan.annualRate,
          loan.minEmi.toString()
        ]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  saveLoans
};
