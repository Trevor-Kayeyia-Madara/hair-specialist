import { query } from "../config/db";

const createUserTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      userType VARCHAR(50) NOT NULL CHECK (userType IN ('customer', 'specialist')),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// eslint-disable-next-line no-undef
export default { pool, createUserTable };
