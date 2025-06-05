
import mysql from 'mysql2/promise';
import "dotenv/config";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,          // Puerto que estás usando (33306)
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


export async function initDB() {
  try {

    const createTableQuery = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
   `;

    await pool.query(createTableQuery);

    console.log('✅ Conexión a la base de datos exitosa');

  } catch (error) {

    console.error('❌ Error en la conexión. Verifique la configuración.');
    console.error(error);
    process.exit(1);

  }
}
