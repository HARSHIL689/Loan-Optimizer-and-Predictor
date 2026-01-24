function validateLoans(loans) {
  if (!Array.isArray(loans) || loans.length === 0) {
    throw new Error("Loans must be a non-empty array");
  }
}

function validateNumber(value, name) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
}  

module.exports = {
  validateLoans,
  validateNumber
};
