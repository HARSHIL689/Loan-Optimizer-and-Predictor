const express = require("express");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes");
const cors = require("cors");
const app = express();
const scenarioRoutes = require("./routes/scenarioRoutes")

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/scenarios",scenarioRoutes)

module.exports = app;
