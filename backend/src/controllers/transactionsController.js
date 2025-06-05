import { pool } from "../config/db.js";

// traer transactiones por id
export async function getTransactionsByUserId(req, res) {
  try {
    const { userid } = req.params;

    const [rows] = await pool.execute(
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC",
      [userid]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
// crear transactiones
export async function createTransaction(req, res) {
  // title, amount, category,user_id
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    const insertQuery = `
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertQuery, [user_id, title, amount, category]);

    // Luego recuperas la fila insertada (opcional)
    const [rows] = await pool.query(
      "SELECT * FROM transactions WHERE id = ?",
      [result.insertId]
    );

    console.log(insertQuery);

    res.status(201).json({
      message: "Transacción creada exitosamente",
      transaction: rows[0], // o toda la fila
    });

  } catch (error) {
    console.log("Error al generar la transaccion", error)
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

//eliminar transactiones con id
export async function deleteTranssaciton(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Id incorrecto corrijalo eh intelelo de nuevo" })
    }
    // Ejecutar el delete
    const [result] = await pool.execute(
      "DELETE FROM transactions WHERE id = ?",
      [id]
    );

    // Verificar si se eliminó alguna fila
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No hay contenido. ID no encontrado." });
    }

    res.status(200).json({ message: "La transacción fue eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar el ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// resumen de transactiones
export async function summaryTransaction(req, res) {
  try {
    const { userId } = req.params;

    const [balanceResult] = await pool.execute(`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ?
    `, [userId]);

    const [incomeResult] = await pool.execute(`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ? AND amount > 0
    `, [userId]);

    const [expensesResult] = await pool.execute(`
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM transactions
      WHERE user_id = ? AND amount < 0
    `, [userId]);

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses
    });
  } catch (error) {
    console.error("Error al obtener resumen:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
