const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "1h";

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
