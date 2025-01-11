import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import Shipment from "../models/Shipment.model";
import { UserType } from "../utils/enum.util";
import { generateRandomChars } from "../utils/helper.util";
import User from "../models/User.model";

/**
 * @name getShipment
 * @description Retrieves shipment details for a specific order
 * @route GET /shipment/:orderId
 * @access  Private
 */
export const getShipment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    const shipment = await Shipment.findOne({ order: orderId });

    if (!shipment) {
      return next(new ErrorResponse("Shipment not found", 404, []));
    }

    res.status(200).json({
      error: false,
      message: "Shipment details retrieved successfully.",
      data: shipment,
    });
  }
);

/**
 * @name createShipment
 * @description Creates a new shipment for an order
 * @route POST /shipment
 * @access  Private
 */
export const createShipment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const { role} = req.user; 
    if (![UserType.ADMIN, UserType.SUPER].includes(role)) {
      return next(new ErrorResponse("Access denied. Admins only.", 403, []));
    }

    const { userId, orderId, address, carrier } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse("User not found.", 404, []));
    }

    if (!address || typeof address !== "string") {
      return next(new ErrorResponse("A valid address is required.", 400, []));
    }   

    const trackingNumber = generateRandomChars(20)
    const shipmentDate = new Date();
    shipmentDate.setDate(shipmentDate.getDate() + 3);

    const shipment = new Shipment({
      user: userId,
      order: orderId,
      carrier,
      address,
      trackingNumber,
      shipmentDate,
    });

    await shipment.save();

    res.status(201).json({
      error: false,
      message: "Shipment created successfully.",
      data: shipment,
    });
  }
);

/**
 * @name updateShipmentStatus
 * @description Updates the status of a shipment
 * @route PUT /shipment/:shipmentId/status
 * @access  Private (Admin & Super Admin)
 */
export const updateShipmentStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user;
    if (![UserType.ADMIN, UserType.SUPER].includes(role)) {
      return next(new ErrorResponse("Access denied. Admins only.", 403, []));
    }

    const { shipmentId } = req.params;
    const { status } = req.body;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return next(new ErrorResponse("Shipment not found", 404, []));
    }

    await shipment.updateShipmentStatus(status);

    res.status(200).json({
      error: false,
      message: "Shipment status updated successfully.",
      data: shipment,
    });
  }
);

/**
 * @name updateTrackingNumber
 * @description Updates the tracking number of a shipment
 * @route PUT /shipment/:shipmentId/trackingNumber
 * @access  Private
 */
export const updateTrackingNumber = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { shipmentId } = req.params;
    const { trackingNumber } = req.body;

    const shipment = await Shipment.findById(shipmentId);

    if (!shipment) {
      return next(new ErrorResponse("Shipment not found", 404, []));
    }

    await shipment.updateTrackingNumber(trackingNumber);

    res.status(200).json({
      error: false,
      message: "Tracking number updated successfully.",
      data: shipment,
    });
  }
);
