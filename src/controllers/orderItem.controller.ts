import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import OrderItem from "../models/OrderItem.model";
import Product from "../models/Product.model";

/**
 * @name createOrderItem
 * @description Adds an item to an order
 * @route POST /order-item
 * @access Private
 */
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

/**
 * @name getOrderItemsByOrder
 * @description Retrieves all items for a specific order
 * @route GET /order-item/:orderId
 * @access Private
 */
export const getOrderItemsByOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    const orderItems = await OrderItem.find({ order: orderId }).populate("product");

    if (!orderItems.length) {
      return next(new ErrorResponse("No items found for this order", 404, []));
    }

    res.status(200).json({
      error: false,
      message: "Order items retrieved successfully.",
      data: orderItems,
    });
  }
);

/**
 * @name updateOrderItem
 * @description Updates an existing order item's quantity or price
 * @route PUT /order-item/:id
 * @access Private
 */
export const updateOrderItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { quantity, pricePerUnit, discount } = req.body;

    const orderItem = await OrderItem.findById(id);
    if (!orderItem) {
      return next(new ErrorResponse("Order item not found", 404, []));
    }

    const product = await Product.findById(orderItem.product);
    if (!product) {
      return next(new ErrorResponse("Product not found", 404, []));
    }

    const quantityDifference = quantity - orderItem.quantity;
    if (quantityDifference > 0 && product.stockQuantity < quantityDifference) {
      return next(new ErrorResponse("Insufficient stock to update quantity", 400, []));
    }
    product.stockQuantity -= quantityDifference;
    await product.save();

    orderItem.quantity = quantity;
    orderItem.pricePerUnit = pricePerUnit;
    orderItem.discount = discount;
    await orderItem.save();

    res.status(200).json({
      error: false,
      message: "Order item updated successfully.",
      data: orderItem,
    });
  }
);

/**
 * @name deleteOrderItem
 * @description Removes an item from an order
 * @route DELETE /order-item/:id
 * @access Private
 */
export const deleteOrderItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const orderItem = await OrderItem.findById(id);
    if (!orderItem) {
      return next(new ErrorResponse("Order item not found", 404, []));
    }

    const product = await Product.findById(orderItem.product);
    if (product) {
      product.stockQuantity += orderItem.quantity;
      await product.save();
    }

    await orderItem.remove();

    res.status(200).json({
      error: false,
      message: "Order item deleted successfully.",
    });
  }
);
