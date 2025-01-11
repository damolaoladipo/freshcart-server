import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import Transaction from "../models/Transaction.model";
import { PaymentGatewayFactory } from "../services/payment/paymentfactory.service";
import Order from "../models/Order.model";
import { IUserDoc } from "../utils/interface.util";
import { PaymentPartners, PaymentStatus } from "../utils/enum.util";



/**
 * @name createTransaction
 * @description Creates a new transaction for an order
 * @route POST /transaction
 * @access  Private
 */
// export const createTransaction = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { orderId, amount, currency, paymentProvider, callback_url } = req.body;

//     const order = await Order.findById(orderId).populate<{ user: IUserDoc }>('user')
//     if (!order || !order.user) {
//       return next(new ErrorResponse("Order or user not found", 404, []));
//     }

//     const reference = `txn_${Date.now()}`;
//     const paymentGateway = PaymentGatewayFactory.createGateway(paymentProvider);

//     const paymentInit = await paymentGateway.initializePayment({
//       email: order.user.email, 
//       amount: amount * 100,
//       currency,
//       reference,
//       callback_url,
//     });

//     const transaction = new Transaction({
//       order: orderId,
//       amount,
//       method: paymentProvider,
//       currency,
//       paymentReference: reference,
//       paymentPartner: paymentProvider,
//       status: PaymentStatus.PENDING,
//       paymentUrl: paymentInit.data.authorization_url,
//     });;

//     await transaction.processTransaction();

//     res.status(201).json({
//       error: false,
//       message: "Transaction processed successfully.",
//       data: transaction,
//     });
//   }
// );


export const createTransaction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, amount, currency, paymentProvider, callback_url } = req.body;

    if (!Object.values(PaymentPartners).includes(paymentProvider)) {
      console.error(`Unsupported payment provider: ${paymentProvider}`);
      return next(
        new ErrorResponse(`Invalid payment provider: ${paymentProvider}`, 400, [])
      );
    }

    if (!orderId || !amount || !currency || !paymentProvider || !callback_url) {
      return next(new ErrorResponse("Invalid request data", 400, []));
    }

    const order = await Order.findById(orderId).populate<{ user: IUserDoc }>('user');
    if (!order || !order.user) {
      return next(new ErrorResponse("Order or user not found", 404, []));
    }

    const reference = `txn_${Date.now()}`;
    let paymentGateway;

    try {
      paymentGateway = PaymentGatewayFactory.createGateway(paymentProvider);
    } catch (error) {
      console.error("Payment provider error:", error.message);
      return next(new ErrorResponse("Invalid payment provider payatac", 400, []));
    }

  
    const paymentInit = await paymentGateway.initializePayment({
        email: order.user.email,
        amount: amount * 100,
        currency,
        reference,
        callback_url,
      });
      if (paymentInit.error){
        return next (
          new ErrorResponse("Error", paymentInit.code!, [paymentInit.message])
        )
      }
      
    const transaction = new Transaction({
      order: orderId,
      amount,
      method: paymentProvider,
      currency,
      paymentReference: reference,
      paymentPartner: paymentProvider,
      status: PaymentStatus.PENDING,
      paymentUrl: paymentInit.data.authorization_url,
    });

    try {
      await transaction.processTransaction();
    } catch (error) {
      console.error("Transaction processing error:", error.message);
      return next(new ErrorResponse("Failed to process transaction", 500, []));
    }

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
    const { status, provider } = req.body;
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return next(new ErrorResponse("Transaction not found", 404, []));
    }

    const paymentGateway = PaymentGatewayFactory.createGateway(provider);
    const verification = await paymentGateway.verifyPayment(transaction.id);
    if (!verification.success) {
      transaction.status = "failed";
      await transaction.save();
      return next(new ErrorResponse("Payment verification failed", 400, []));
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
