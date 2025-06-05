import express from 'express';
import {
  createTransaction,
  deleteTranssaciton,
  getTransactionsByUserId,
  summaryTransaction
} from "../controllers/transactionsController.js";

const router = express.Router();

// trae las transacciones
router.get("/:userid", getTransactionsByUserId);

// metodo post de transaccion
router.post("/", createTransaction);

// eleimina la transaccion
router.delete("/:id", deleteTranssaciton);

// summary
router.get("/summary/:userId", summaryTransaction);

export default router;
