const express = require("express");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes");
const cors = require("cors");
const app = express();
const scenarioRoutes = require("./routes/scenarioRoutes")

app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",
    "https://loan-optimizer-and-predictor.netlify.app"
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true
    })
);
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/scenarios",scenarioRoutes)
app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
});
  

module.exports = app;
