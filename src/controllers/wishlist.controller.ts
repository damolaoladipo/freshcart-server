import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import WishList from "../models/Wishlist.model";

/**
 * @name getWishList
 * @description Retrieves a user's wishlist
 * @route GET /wishlist
 * @access  Private
 */
export const getWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const wishList = await WishList.findOne({ user: userId }).populate("products.productId");

    if (!wishList) {
      return next(new ErrorResponse("Wishlist not found", 404, []));
    }

    res.status(200).json({
      error: false,
      message: "Wishlist retrieved successfully.",
      data: wishList,
    });
  }
);

/**
 * @name addProductToWishList
 * @description Adds a product to the user's wishlist
 * @route POST /wishlist/product
 * @access  Private
 */
export const addProductToWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      wishList = new WishList({ user: userId, products: [] });
    }

    await wishList.addProduct(productId, quantity);

    res.status(201).json({
      error: false,
      message: "Product added to wishlist successfully.",
      data: wishList,
    });
  }
);

/**
 * @name removeProductFromWishList
 * @description Removes a product from the user's wishlist
 * @route DELETE /wishlist/product/:productId
 * @access  Private
 */
export const removeProductFromWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      return next(new ErrorResponse("Wishlist not found", 404, []));
    }

    await wishList.removeProduct(productId);

    res.status(200).json({
      error: false,
      message: "Product removed from wishlist successfully.",
      data: wishList,
    });
  }
);

/**
 * @name updateProductQuantityInWishList
 * @description Updates the quantity of a product in the user's wishlist
 * @route PUT /wishlist/product/:productId
 * @access  Private
 */
export const updateProductQuantityInWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const wishList = await WishList.findOne({ user: userId });

    if (!wishList) {
      return next(new ErrorResponse("Wishlist not found", 404, []));
    }

    await wishList.updateProductQuantity(productId, quantity);

    res.status(200).json({
      error: false,
      message: "Product quantity updated successfully in wishlist.",
      data: wishList,
    });
  }
);
