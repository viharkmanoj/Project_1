require("dotenv").config();

const express = require("express");
const cors = require("cors");

const queryRoute = require("./routes/queryRoute");

const app = express();

app.use(cors());
app.use(express.json());

// Debug logger
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// Main route
app.use("/query", queryRoute);

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});