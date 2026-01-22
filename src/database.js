import mysql from 'mysql2/promise'; // Recomendado en 2026 por soporte async/await
import 'dotenv/config'; // Carga las variables automáticamente

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,      // Si esto llega vacío, lanza el error
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;