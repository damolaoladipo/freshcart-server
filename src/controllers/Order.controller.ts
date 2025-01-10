import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import Order from "../models/Order.model";
import Product from "../models/Product.model";
import Cart from "../models/Cart.model";
import Shipment from "../models/Shipment.model";
import Address from "../models/Address.model";
import OrderItem from "../models/OrderItem.model";



/**
 * @name createOrder
 * @description Creates a new order for the user
 * @route POST /order
 * @access  Private
 */
export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, address, orderItems, totalAmount, shipment } = req.body;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.products.length === 0) {``
      return next(new ErrorResponse("Cart is empty or not found", 400, []));  
    }
   
    const userAddress = await Address.findOne({ id: address, user: userId });
    if (!userAddress) {
    return next(new ErrorResponse("Invalid address provided.", 400, []));
    }

    const shipmentMethod = await Shipment.findById(shipment);
    if (!shipmentMethod) {
    return next(new ErrorResponse("Invalid shipment method.", 400, []));
    }

    const order = new Order({
      user: userId,
      address,
      orderItems,
      totalAmount,
      shipment,
    });
    await order.save()
    

    cart.products = [];
    cart.coupon = null;
    await cart.save();

    await order.placeOrder();

    res.status(201).json({
      error: false,
      message: "Order placed successfully. Proceed to payment.",
      data: {order}
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
 * @name cancelOrder
 * @description Cancels an order before it is shipped
 * @route DELETE /order/:id
 * @access  Private
 */
export const cancelOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ErrorResponse("Order not found", 404, []));
    }

    if (order.status === "shipped" || order.status === "completed") {
      return next(new ErrorResponse("Cannot cancel an order that is already shipped or completed", 400, []));
    }

    
    order.status = "cancelled";
    
    
    order.orderItems.forEach( async (item) => {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stockQuantity += item.quantity;
        product.save();
      }
    });

    await order.save();

    res.status(200).json({
      error: false,
      message: "Order cancelled successfully.",
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

/**
 * @name trackOrder
 * @description Provides tracking information for a specific order
 * @route GET /order/track/:id
 * @access  Private
 */
export const trackOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ErrorResponse("Order not found", 404, []));
    }

    
    const trackingInfo = order.shipment?.trackingNumber
      ? {
          trackingNumber: order.shipment.trackingNumber,
          status: order.shipment.status,
          shipmentDate: order.shipment.shipmentDate,
        }
      : null;

    if (!trackingInfo) {
      return next(new ErrorResponse("No tracking information available", 404, []));
    }

    res.status(200).json({
      error: false,
      message: "Order tracking information retrieved successfully.",
      data: trackingInfo,
    });
  }
);