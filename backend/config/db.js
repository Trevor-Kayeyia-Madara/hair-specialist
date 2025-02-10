import { Pool } from "pg";
// eslint-disable-next-line no-undef
require("dotenv").config();

// eslint-disable-next-line no-undef
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default pool;
