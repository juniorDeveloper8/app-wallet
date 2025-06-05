import express from "express";
import dotenv from "dotenv";
import limiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(limiter);

const PORT = process.env.PORT || 5001;

app.use("/api/transactions", transactionsRoute);

// inisio del servidor
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  });
});


