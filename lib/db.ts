import mysql from "mysql2/promise";

let pool: mysql.Pool;

if (process.env.DATABASE_URL) {
  // Production - pakai DATABASE_URL dari Railway
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  // Development - pakai env vars lokal
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

export default pool;