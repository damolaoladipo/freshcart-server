import { Request, Response, NextFunction } from "express";
import crypto from 'crypto';
import Order from '../models/Order.model';
import User from '../models/User.model';
import PaymentGateway from '../models/PaymentGateway.model';
import Address from '../models/Address.model';
import Transaction from '../models/Transaction.model';
import { IResult } from '../utils/interface.util';

class CheckoutService {
  constructor() {}

  /**
   * @name addAddress
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async addAddress(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { userId, addressDetails } = req.body;

    try {
      const user = await User.findById(userId);

      if (!user) {
        result.error = true;
        result.message = "User not found";
        result.code = 404;
        return result;
      }

      const newAddress = new Address(addressDetails);
      user.addresses.push(newAddress);
      await user.save();

      result.error = false;
      result.message = "Address added successfully";
      result.data = newAddress;
      return result;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name updateAddress
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async updateAddress(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { userId, addressId, updatedAddressDetails } = req.body;

    try {
      const user = await User.findById(userId);

      if (!user) {
        result.error = true;
        result.message = "User not found";
        result.code = 404;
        return result;
      }

      const address = user.addresses.id(addressId);

      if (!address) {
        result.error = true;
        result.message = "Address not found";
        result.code = 404;
        return result;
      }

      Object.assign(address, updatedAddressDetails);
      await user.save();

      result.error = false;
      result.message = "Address updated successfully";
      result.data = address;
      return result;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name selectShippingAddress
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async selectShippingAddress(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { userId, addressId } = req.body;

    try {
      const user = await User.findById(userId);

      if (!user) {
        result.error = true;
        result.message = "User not found";
        result.code = 404;
        return result;
      }

      const address = user.addresses.id(addressId);

      if (!address) {
        result.error = true;
        result.message = "Address not found";
        result.code = 404;
        return result;
      }

      user.selectedAddress = addressId;
      await user.save();

      result.error = false;
      result.message = "Shipping address selected successfully";
      result.data = address;
      return result;
    } catch (error) {
      next(error);
    }
  }

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

      // Assume we have a method to process the payment with the payment partner's API
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
   * @name getOrderSummary
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async getOrderSummary(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { orderId } = req.params;

    try {
      const order = await Order.findById(orderId).populate('orderItems.product');

      if (!order) {
        result.error = true;
        result.message = "Order not found";
        result.code = 404;
        return result;
      }

      result.error = false;
      result.message = "Order summary fetched successfully";
      result.data = order;
      return result;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name confirmOrder
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async confirmOrder(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const { orderId } = req.body;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        result.error = true;
        result.message = "Order not found";
        result.code = 404;
        return result;
      }

      order.status = 'Confirmed';
      await order.save();

      result.error = false;
      result.message = "Order confirmed successfully";
      result.data = order;
      return result;
    } catch (error) {
      next(error);
    }
  }
}

export default new CheckoutService();
