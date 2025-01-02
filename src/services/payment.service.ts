import { Request, Response, NextFunction } from "express";
import crypto from 'crypto';
import Order from '../models/Order.model';
import Transaction from '../models/Transaction.model';
import PaymentGateway from '../models/PaymentGateway.model';
import { IResult } from '../utils/interface.util';

class PaymentService {
  constructor() {}

  /**
   * @name processPayment
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async processPayment(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { orderId, paymentDetails } = req.body;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        result.error = true;
        result.message = "Order not found";
        result.code = 404;
        return result;
      }

      const paymentPartner = await PaymentGateway.findById(paymentDetails.partnerId);

      if (!paymentPartner) {
        result.error = true;
        result.message = "Payment partner not found";
        result.code = 404;
        return result;
      }

      // Assuming we have a method to integrate with payment gateway's API
      const paymentResult = await paymentPartner.processPayment(paymentDetails);

      if (!paymentResult.success) {
        result.error = true;
        result.message = "Payment processing failed";
        result.code = 500;
        return result;
      }

      const transaction = new Transaction({
        order: orderId,
        amount: order.totalAmount,
        method: paymentDetails.method,
        currency: paymentDetails.currency,
        paymentPartner: paymentDetails.partnerId,
        date: new Date(),
        status: 'Completed',
      });

      await transaction.save();

      order.payment = transaction._id;
      order.status = 'Paid';
      await order.save();

      result.error = false;
      result.message = "Payment processed successfully";
      result.data = { transaction, order };
      return result;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name refundPayment
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async refundPayment(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { transactionId, refundDetails } = req.body;

    try {
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        result.error = true;
        result.message = "Transaction not found";
        result.code = 404;
        return result;
      }

      if (transaction.status === 'Refunded') {
        result.error = true;
        result.message = "Transaction already refunded";
        result.code = 400;
        return result;
      }

      const paymentPartner = await PaymentGateway.findById(transaction.paymentPartner);

      if (!paymentPartner) {
        result.error = true;
        result.message = "Payment partner not found";
        result.code = 404;
        return result;
      }

      // Assuming we have a method to interact with the payment partner's API to process refunds
      const refundResult = await paymentPartner.processRefund(transaction.amount, refundDetails);

      if (!refundResult.success) {
        result.error = true;
        result.message = "Refund processing failed";
        result.code = 500;
        return result;
      }

      transaction.status = 'Refunded';
      await transaction.save();

      result.error = false;
      result.message = "Refund processed successfully";
      result.data = transaction;
      return result;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name getTransactionHistory
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async getTransactionHistory(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { userId } = req.params;

    try {
      const transactions = await Transaction.find({ user: userId }).populate('order').populate('paymentPartner');

      if (!transactions || transactions.length === 0) {
        result.error = true;
        result.message = "No transactions found for this user";
        result.code = 404;
        return result;
      }

      result.error = false;
      result.message = "Transaction history fetched successfully";
      result.data = transactions;
      return result;
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentService();
