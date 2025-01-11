import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import Cart from "../models/Cart.model";
import ErrorResponse from "../utils/error.util";
import Product from "../models/Product.model";
import { ICartDoc, IProductDoc } from "../utils/interface.util";

/**
 * @name createCart
 * @description Creates a new cart for the user
 * @route POST /cart
 * @access  Private
 */
export const createCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    const existingCart = await Cart.findOne({ user: userId });

    if (existingCart) {
      return res.status(400).json({
        error: true,
        message: "An active cart already exists for this user.",
        data: existingCart,
      });
    }

    const cart = new Cart({ 
      user: userId, 
      products: [], 
      coupon: null, 
      checkout: false 
    });
    
    await cart.save();

    res.status(201).json({
      error: false,
      message: "Cart created successfully.",
      data: cart,
    });
  }
);

/**
 * @name getCart
 * @description Retrieves the cart for a user
 * @route GET /cart/:userId
 * @access  Private
 */
export const getCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.id", 
      model: "Product", 
    });

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404, []));
    }

    res.status(200).json({
      error: false,
      message: "Cart retrieved successfully.",
      data: cart,
    });
  }
);


/**
 * @name updateProductQuantity
 * @description Updates the quantity of a specific product in the cart
 * @route PUT /cart/:userId/update
 * @access Private
 */
export const updateProductQuantity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    if (!productId || quantity == null) {
      return res.status(400).json({
        error: true,
        message: "Product ID and quantity are required.",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404, []));
    }

    const productIndex = cart.products.findIndex(
      (item) => item.id.toString() === productId
    );

    if (productIndex === -1) {
      return next(new ErrorResponse("Product not found in cart.", 404, []));
    }

    if (quantity <= 0) {
      cart.products.splice(productIndex, 1); 
    } else {
      cart.products[productIndex].stockQuantity = quantity; 
    }

    await cart.save();

    res.status(200).json({
      error: false,
      message: "Product quantity updated in cart.",
      data: cart,
    });
  }
);

/**
 * @name addToCart
 * @description Adds a product to the cart
 * @route PUT /cart/:userId/add
 * @access  Private
 */
export const addToCarts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      console.log("product id", productId, "quantity", quantity)
      return res.status(400).json({ error: true, message: "ProductId and quantity are required." });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404, []));
    }

    await cart.addToCart(productId, quantity);

    res.status(200).json({
      error: false,
      message: "Product added to cart.",
      data: cart,
    });
  }
);

/**
 * @name removeFromCart
 * @description Removes a product from the cart
 * @route PUT /cart/:userId/remove
 * @access  Private
 */
export const removeFromCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404, []));
    }

    await cart.removeFromCart(productId);

    res.status(200).json({
      error: false,
      message: "Product removed from cart.",
      data: cart,
    });
  }
);


/**
 * @name checkout
 * @description Proceeds to checkout for the cart
 * @route PUT /cart/:userId/checkout
 * @access  Private
 */
export const checkout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params

    const cart = await Cart.findOne({ user: userId }).populate<{
        products: { id: IProductDoc, quantity: number  }[];
      }>({
      path: "products.id", 
      model: "Product", 
    })

    console.log("user cart", cart);

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404, []));
    }

    if (cart.products.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Cart cannot be empty. Please add products before proceeding.",
      });
    }

    let totalPrice = 0;

    for (const item of cart.products) {

      const product = item.id as IProductDoc
      const quantity = item.quantity

      if (!product || !quantity) {
        throw new ErrorResponse(
          `Product details are incomplete for one or more products in the cart.`,
           400, []);
      }
      
      
      if (product.stockQuantity < quantity) {
        throw new ErrorResponse(`Product ${product} is out of stock.`, 400, []);
      }

      const productPrice = product.price;
      const discount = product.discount || 0;
      const finalPrice = productPrice - (productPrice * discount) / 100;
      totalPrice += finalPrice * quantity;
    }
        
    await cart.proceedToCheckout();

    res.status(200).json({
      error: false,
      message: "Checkout successful.",
      data: {cart, totalPrice}
    });
  }
);


/**
 * @name clearCart
 * @description Clears all products and coupons from the cart
 * @route DELETE /cart/:userId
 * @access Private
 */
export const clearCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404, []));
    }

    cart.products = [];
    cart.coupon = null;
    await cart.save();

    res.status(200).json({
      error: false,
      message: "Cart cleared successfully.",
      data: cart,
    });
  }
);




//Future Iteration

/**
 * @name applyCoupon
 * @description Applies a coupon to the cart
 * @route PUT /cart/:userId/coupon
 * @access  Private
 */
export const applyCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { coupon } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404, []));
    }

    await cart.applyCoupon(coupon);

    res.status(200).json({
      error: false,
      message: "Coupon applied.",
      data: cart,
    });
  }
);
