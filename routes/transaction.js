import express from "express";
import { addTransaction, getUserTransactions, getTransactionByType } from "../controllers/transactions.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", verifyToken, addTransaction);
router.get("/:userId", verifyToken, getUserTransactions);
router.get("/:userId/:type", verifyToken, getTransactionByType);

export default router;