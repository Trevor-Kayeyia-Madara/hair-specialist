import { Router } from "express";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { query } from "../config/db";

const router = Router();
// eslint-disable-next-line no-undef
const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
router.post("/register", async (req, res) => {
  const { email, password, name, userType, location, specialty } = req.body;
  const hashedPassword = await hash(password, 10);

  try {
    const result = await query(
      "INSERT INTO users (email, password, name, userType, location) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, hashedPassword, name, userType, location, specialty]
    );

    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "User already exists" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];

    if (user && (await compare(password, user.password))) {
      const token = sign({ id: user.id, userType: user.userType }, JWT_SECRET);
      res.json({ token, user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
