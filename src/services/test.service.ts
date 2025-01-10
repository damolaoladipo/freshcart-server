import { Request, Response, NextFunction } from "express";
import PaystackInlineJs, { PaystackOptions } from '@paystack/inline-js';
import { IResult } from '../utils/interface.util';

class PaystackService {
  private paystack: PaystackInlineJs;

  constructor(publicKey: string) {
    this.paystack = new PaystackInlineJs(publicKey);
  }

  /**
   * @name initiatePayment
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async initiatePayment(req: Request, res: Response, next: NextFunction): Promise<IResult | any> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { email, amount, currency, reference, channels } = req.body;

    try {
      const paymentOptions: PaystackOptions = {
        email,
        amount,
        currency,
        reference,
        channels,
        callback: async (response) => {
          console.log('Payment successful:', response);
          await this.handlePaymentCallback(response);
        },
        onClose: () => {
          console.log('Payment modal closed');
          result.error = true;
          result.message = "Payment modal was closed";
          result.code = 400;
          return result;
        }
      };

      this.paystack.openPaymentPopup(paymentOptions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name handlePaymentCallback
   * @param response - The payment response from Paystack
   * @returns { Promise<IResult> } - see IResult
   */
  private async handlePaymentCallback(response: any): Promise<IResult | any> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    try {
      if (response.status === 'success') {
        result.error = false;
        result.message = "Payment processed successfully";
        result.data = response;
        return result;
      } else {
        result.error = true;
        result.message = "Payment failed";
        result.code = 500;
        return result;
      }
    } catch (error) {
      console.error('Error handling payment callback:', error);
      throw error;
    }
  }
}

export default PaystackService;


import PaystackService from './PaystackService';

// Paystack public key (replace this with your actual Paystack public key)
const PAYSTACK_PUBLIC_KEY = 'your-paystack-public-key';

// Create an instance of the Paystack service
const paystackService = new PaystackService(PAYSTACK_PUBLIC_KEY);

// Route to initiate payment
app.post('/paystack/initiate-payment', async (req: Request, res: Response, next: NextFunction) => {
  const result = await paystackService.initiatePayment(req, res, next);
  res.status(result.code).send(result);
});



import axios from 'axios';
import { Transaction } from '../models/Transaction.model';
import { Order } from '../models/Order.model';
import { PaymentPartner } from '../models/PaymentPartner.model';
import ErrorResponse from "../utils/error.util";

class PaymentService {
  /**
   * Initialize a payment using Paystack API
   * @param {string} orderId - ID of the order to process payment for
   * @returns {Promise<object>} - Payment initialization response
   */
  static async initiatePayment(orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ErrorResponse("Order not found", 404, []);
    }

    const paymentData = {
      email: 'customer@example.com',  // This should come from user session or input
      amount: order.totalAmount * 100,  // Convert amount to kobo
      callback_url: `${process.env.CLIENT_URL}/payment/callback`,  // Payment success/failure callback URL
      metadata: {
        orderId: orderId,
      },
    };

    try {
      const response = await axios.post('https://api.paystack.co/transaction/initialize', paymentData, {
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      return response.data.data;
    } catch (error) {
      throw new ErrorResponse("Failed to initialize payment", 500, []);
    }
  }

  /**
   * Handle payment success
   * @param {string} reference - Paystack transaction reference
   * @returns {Promise<object>} - Updated transaction and order info
   */
  static async handlePaymentSuccess(reference) {
    const transaction = await Transaction.findOne({ reference });
    if (!transaction) {
      throw new ErrorResponse("Transaction not found", 404, []);
    }

    const order = await Order.findById(transaction.order);
    if (!order) {
      throw new ErrorResponse("Order not found", 404, []);
    }

    order.status = 'Paid';
    await order.save();

    transaction.status = 'Successful';
    await transaction.save();

    return {
      message: "Payment processed successfully",
      transaction,
      order,
    };
  }

  /**
   * Handle payment failure
   * @param {string} reference - Paystack transaction reference
   * @param {string} reason - Reason for payment failure
   * @returns {Promise<object>} - Updated transaction and order info
   */
  static async handlePaymentFailure(reference, reason) {
    const transaction = await Transaction.findOne({ reference });
    if (!transaction) {
      throw new ErrorResponse("Transaction not found", 404, []);
    }

    const order = await Order.findById(transaction.order);
    if (!order) {
      throw new ErrorResponse("Order not found", 404, []);
    }

    order.status = 'Failed';
    await order.save();

    transaction.status = 'Failed';
    transaction.error = reason;
    await transaction.save();

    return {
      message: "Payment failed",
      transaction,
      order,
    };
  }

  /**
   * Verify payment using Paystack webhook
   * @param {object} webhookData - Data from Paystack webhook
   * @returns {Promise<object>} - Result of handling webhook
   */
  static async handleWebhook(webhookData) {
    const { data, event } = webhookData;

    switch (event) {
      case 'transaction.success':
        return await this.handlePaymentSuccess(data.reference);
      case 'transaction.failed':
        return await this.handlePaymentFailure(data.reference, data.gateway_response);
      default:
        throw new ErrorResponse("Unknown event", 400, []);
    }
  }
}

export default PaymentService;










import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import Order from "../models/Order.model";
import PaymentService from "../services/PaymentService";

/**
 * @name createOrder
 * @description Creates a new order and initiates the payment process
 * @route POST /order
 * @access  Private
 */
export const createOrder = asyncHandler(
  async (req, res, next) => {
    const { items, totalAmount } = req.body;

    const order = new Order({
      items,
      totalAmount,
      user: req.user.id,  // assuming req.user is set after verification middleware
    });

    await order.save();

    // Initiating payment
    const paymentData = await PaymentService.initiatePayment(order._id);

    res.status(201).json({
      error: false,
      message: "Order created successfully, please proceed with payment.",
      data: paymentData,
    });
  }
);

/**
 * @name handlePaymentCallback
 * @description Handles Paystack's payment callback and updates order and transaction
 * @route POST /payment/callback
 * @access  Public
 */
export const handlePaymentCallback = asyncHandler(
  async (req, res, next) => {
    const webhookData = req.body;

    try {
      const result = await PaymentService.handleWebhook(webhookData);

      res.status(200).json({
        error: false,
        message: result.message,
        data: result.transaction || result.order,
      });
    } catch (error) {
      next(error);
    }
  }
);



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
  async (req, res, next) => {
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
  async (req, res, next) => {
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



import { Order } from '../models/Order.model';
import PaymentService from '../services/PaymentService';

/**
 * @name createOrder
 * @description Creates a new order and initiates the payment process
 * @param {object} orderData - Data for creating an order
 * @returns {Promise<object>} - Created order and payment data
 */
export const createOrder = async (orderData) => {
  const order = new Order(orderData);

  await order.save();

  // Initiating payment
  const paymentData = await PaymentService.initiatePayment(order._id);

  return {
    order,
    paymentData,
  };
};

/**
 * @name handlePaymentCallback
 * @description Handles Paystack's payment callback and updates order and transaction
 * @param {object} webhookData - Data from Paystack webhook
 * @returns {Promise<object>} - Result of handling webhook
 */
export const handlePaymentCallback = async (webhookData) => {
  return await PaymentService.handleWebhook(webhookData);
};
export const createOrderItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, productId, quantity, pricePerUnit, discount } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse("Product not found", 404, []));
    }

    if (product.stockQuantity < quantity) {
      return next(
        new ErrorResponse("Insufficient stock for the requested product", 400, [])
      );
    }

    


    const orderItem = new OrderItem({
      order: orderId,
      product: productId,
      quantity,
      pricePerUnit,
      discount,
    });

    await orderItem.save();
    product.stockQuantity -= quantity;
    
    await product.save();

    res.status(201).json({
      error: false,
      message: "Order item created successfully.",
      data: orderItem,
    });
  }
);