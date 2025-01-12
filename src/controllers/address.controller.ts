import { Request, Response, NextFunction } from "express";
import Address from "../models/Address.model";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";


/**
 * @name createAddress
 * @description Creates a new address for a specific user
 * @route POST /v1/address/:userId
 * @access Private
 */
export const createAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
  const { street, city, state, postalCode, country } = req.body;

  const { userId }: any = req.params

  if (!userId) {
    return res.status(400).json({
      error: true,
      message: "User ID is required",
    });
  }

  const address = new Address({ 
    user: userId, 
    street, 
    city, 
    state, 
    postalCode, 
    country 
  });
  await address.save();

  res.status(201).json({
    error: false,
    message: "Address created successfully",
    data: address,
  });
});

// Get all addresses for a user
export const getUserAddresses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const addresses = await Address.find({ user: userId });

  res.status(200).json({
    error: false,
    message: "Addresses fetched successfully",
    data: addresses,
  });
});

// Update an address
export const updateAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
  const { addressId } = req.params;
  const updateData = req.body;

  const address = await Address.findByIdAndUpdate(addressId, updateData, { new: true, runValidators: true });

  if (!address) {
    return next(new ErrorResponse("Address not found", 404, []));
  }

  res.status(200).json({
    error: false,
    message: "Address updated successfully",
    data: address,
  });
});

// Delete an address
export const deleteAddress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { addressId } = req.params;

  const address = await Address.findByIdAndDelete(addressId);

  if (!address) {
    return next(new ErrorResponse("Address not found", 404, []));
  }

  res.status(200).json({
    error: false,
    message: "Address deleted successfully",
    data: address,
  });
});
