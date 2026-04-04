const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { getSQLFromAI } = require("../services/aiService");
const { validateQuery } = require("../utils/validator");

router.post("/", async (req, res) => {
  try {
    const userQuery = req.body?.query;

    if (!userQuery) {
      return res.status(400).json({ error: "Query is required" });
    }

    // AI → SQL
    const sql = await getSQLFromAI(userQuery);

    console.log("Generated SQL:", sql);

    // Validate
    validateQuery(sql);

    // Execute
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        sql,
        data: result
      });
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;