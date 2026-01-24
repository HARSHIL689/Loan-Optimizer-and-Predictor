const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token missing",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("AUTH HEADER:", req.headers.authorization);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("JWT DECODED:", decoded);

    req.user = {
      id: decoded.id || decoded.userId || decoded.sub,
      email: decoded.email,
    };
    console.log("REQ.USER SET TO:", req.user);

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = authMiddleware;
