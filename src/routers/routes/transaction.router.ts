import { Router } from "express";
import { 
  createTransaction, 
  getTransaction, 
  updateTransactionStatus, 
  getOrderTransactions 
} from "../../controllers/transaction.controller";
import checkAuth from "../../middlewares/checkAuth.mdw";

const transactionRouter = Router();

transactionRouter.post("/", checkAuth, createTransaction);
transactionRouter.get("/:id", checkAuth, getTransaction);
transactionRouter.put("/:id/status", checkAuth, updateTransactionStatus);
transactionRouter.get("/:orderId", checkAuth, getOrderTransactions);

export default transactionRouter;
