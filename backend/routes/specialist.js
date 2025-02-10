import { Router } from "express";
import { query } from "../config/db";
const router = Router();

// Get all specialists
router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT id, name, location, specialty FROM users WHERE userType='specialist'");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch specialists" });
  }
});

// Get specialists by specialty and location
router.get("/search", async (req, res) => {
  const { specialty, location } = req.query;

  try {
    const result = await query(
      "SELECT id, name, location, specialty FROM users WHERE userType='specialist' AND specialty ILIKE $1 AND location ILIKE $2",
      [`%${specialty}%`, `%${location}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
