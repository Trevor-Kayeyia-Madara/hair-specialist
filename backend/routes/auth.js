/* eslint-disable no-undef */
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name, userType, location, specialty } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (email, password, name, userType, location, specialty) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, hashedPassword, name, userType, location, specialty]
    );

    res.json({ user: result.rows[0] });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "User already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line no-undef
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({ token, user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
