import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import Shipment from "../models/Shipment.model";

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
    const { orderId, address, trackingNumber, shipmentDate } = req.body;
    const userId = req.user.id;

    const shipment = new Shipment({
      user: userId,
      order: orderId,
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
 * @access  Private
 */
export const updateShipmentStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
