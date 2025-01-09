import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../middlewares/async.mdw';
import Product from '../models/Product.model';
import ErrorResponse from '../utils/error.util';

/**
 * @name createProduct
 * @description Registers a new product in the system and returns the created product data
 * @route POST /product
 * @access  Private (Requires merchant authorization)
 */
export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, desc, price, category, tag, stockQuantity, imageURLs, merchant, discount, count } = req.body;
    
    const newProduct = new Product({
      name,
      desc,
      price,
      category,
      tag,
      stockQuantity,
      imageURLs,
      merchant,
      discount,
      count,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      error: false,
      errors: [],
      data: savedProduct,
      message: 'Product created successfully.',
      status: 201,
    });
  }
);


/**
 * @name getAllProducts
 * @description Retrieves all products from the database
 * @route GET /products
 * @access  Public
 */
export const getAllProducts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      
      const products = await Product.find({})
      
      res.status(200).json({
        error: false,
        errors: [],
        data: products,
        message: 'Products retrieved successfully.',
        status: 200,
      });
    }
  );

/**
 * @name getProductById
 * @description Retrieves a product by its ID
 * @route GET /product/:id
 * @access  Public
 */
export const getProductById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorResponse('Error', 404, ['Product not found']));
      }
      res.status(200).json({
        error: false,
        errors: [],
        data: product,
        message: 'Product retrieved successfully.',
        status: 200,
      });
    }
  );


/**
 * @name updateProduct
 * @description Updates the details of an existing product
 * @route PUT /product/:id
 * @access  Private (admin/merchant)
 */
export const updateProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) {
        return next(new ErrorResponse('Error', 404, ['Product not found']));
      }
      res.status(200).json({
        error: false,
        errors: [],
        data: updatedProduct,
        message: 'Product updated successfully.',
        status: 200,
      });
    }
  );

/**
 * @name deleteProduct
 * @description Deletes a product from the database
 * @route DELETE /product/:id
 * @access  Private (admin/merchant)
 */
export const deleteProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return next(new ErrorResponse('Error', 404, ['Product not found']));
      }
      res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'Product deleted successfully.',
        status: 200,
      });
    }
  );


/**
 * @name addToCart
 * @description Adds a product to a user's cart
 * @route POST /product/:productId/cart/:userId
 * @access  Private (user)
 */
export const addToCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return next(new ErrorResponse('Error', 404, ['Product not found']));
      }
      await product.addToCart(req.params.userId);
      res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'Product added to cart successfully.',
        status: 200,
      });
    }
  );


/**
 * @name addTag
 * @description Adds a tag to a product
 * @route PUT /product/:productId/tag
 * @access  Private (admin/merchant)
 */
export const addTag = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return next(new ErrorResponse('Error', 404, ['Product not found']));
      }
      await product.addTag(req.body.tag);
      res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'Tag added successfully.',
        status: 200,
      });
    }
  );


/**
 * @name removeTag
 * @description Removes a tag from a product
 * @route PUT /product/:productId/tag/remove
 * @access  Private (admin/merchant)
 */
export const removeTag = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return next(new ErrorResponse('Error', 404, ['Product not found']));
      }
      await product.removeTag(req.body.tag);
      res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'Tag removed successfully.',
        status: 200,
      });
    }
  );
  

/**
 * @name applyDiscount
 * @description Applies a discount to a product
 * @route PUT /product/:productId/discount
 * @access  Private (admin/merchant)
 */
export const applyDiscount = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return next(new ErrorResponse('Error', 404, ['Product not found']));
      }
      await product.applyDiscount(req.body.discount);
      res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'Discount applied successfully.',
        status: 200,
      });
    }
  );


/**
 * @name removeDiscount
 * @description Removes the discount from a product
 * @route PUT /product/:productId/discount/remove
 * @access  Private (admin/merchant)
 */
export const removeDiscount = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return next(new ErrorResponse('Error', 404, ['Product not found']));
      }
      await product.removeDiscount();
      res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'Discount removed successfully.',
        status: 200,
      });
    }
  );
  