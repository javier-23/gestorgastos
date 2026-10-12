// Conectar a la base de datos
import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});