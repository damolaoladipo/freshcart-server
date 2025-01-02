import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import Order from "../models/Order.model";

/**
 * @name createOrder
 * @description Creates a new order for the user
 * @route POST /order
 * @access  Private
 */
export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, address, orderItems, totalAmount, payment, shipment } = req.body;

    const order = new Order({
      user: userId,
      address,
      orderItems,
      totalAmount,
      payment,
      shipment,
    });

    await order.placeOrder();

    res.status(201).json({
      error: false,
      message: "Order placed successfully.",
      data: order,
    });
  }
);

/**
 * @name getOrder
 * @description Retrieves a specific order for a user
 * @route GET /order/:id
 * @access  Private
 */
export const getOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ErrorResponse("Order not found", 404, []));
    }

    res.status(200).json({
      error: false,
      message: "Order retrieved successfully.",
      data: order,
    });
  }
);

/**
 * @name updateOrderStatus
 * @description Updates the status of an order
 * @route PUT /order/:id/status
 * @access  Private
 */
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ErrorResponse("Order not found", 404, []));
    }

    await order.updateStatus(status);

    res.status(200).json({
      error: false,
      message: "Order status updated successfully.",
      data: order,
    });
  }
);

/**
 * @name getUserOrders
 * @description Retrieves all orders placed by a user
 * @route GET /order/user/:userId
 * @access  Private
 */
export const getUserOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId });

    res.status(200).json({
      error: false,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  }
);
