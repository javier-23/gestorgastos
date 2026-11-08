// Conectar a la base de datos
import pg from "pg";

// Configurar el parser de fechas para que devuelva strings en lugar de objetos Date
pg.types.setTypeParser(1082, value => value)

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});