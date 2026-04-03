require("dotenv").config();

const express = require("express");
const cors = require("cors");

const queryRoute = require("./routes/queryRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/query", queryRoute);

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});

app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});