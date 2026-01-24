const Decimal = require("decimal.js");

function money(value) {
  return new Decimal(value);
}

module.exports = {
  money,
  Decimal
};
