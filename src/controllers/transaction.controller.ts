import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import Transaction from "../models/Transaction.model";

/**
 * @name createTransaction
 * @description Creates a new transaction for an order
 * @route POST /transaction
 * @access  Private
 */
export const createTransaction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, amount, method, currency, paymentPartner } = req.body;

    const transaction = new Transaction({
      order: orderId,
      amount,
      method,
      currency,
      paymentPartner,
    });

    await transaction.processTransaction();

    res.status(201).json({
      error: false,
      message: "Transaction processed successfully.",
      data: transaction,
    });
  }
);

/**
 * @name getTransaction
 * @description Retrieves a specific transaction by transaction ID
 * @route GET /transaction/:id
 * @access  Private
 */
export const getTransaction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return next(new ErrorResponse("Transaction not found", 404, []));
    }

    res.status(200).json({
      error: false,
      message: "Transaction retrieved successfully.",
      data: transaction,
    });
  }
);

/**
 * @name updateTransactionStatus
 * @description Updates the status of a transaction (e.g., "completed", "failed")
 * @route PUT /transaction/:id/status
 * @access  Private
 */
export const updateTransactionStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return next(new ErrorResponse("Transaction not found", 404, []));
    }

    await transaction.updatePaymentStatus(status);

    res.status(200).json({
      error: false,
      message: "Transaction status updated successfully.",
      data: transaction,
    });
  }
);

/**
 * @name getOrderTransactions
 * @description Retrieves all transactions for a specific order
 * @route GET /transaction/order/:orderId
 * @access  Private
 */
export const getOrderTransactions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;

    const transactions = await Transaction.find({ order: orderId });

    res.status(200).json({
      error: false,
      message: "Transactions retrieved successfully.",
      data: transactions,
    });
  }
);
