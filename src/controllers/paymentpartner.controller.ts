import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import PaymentPartner from "../models/PaymentPartner.model";

/**
 * @name createPaymentPartner
 * @description Creates a new payment partner (e.g., Paystack, Flutterwave)
 * @route POST /payment-partner
 * @access  Private
 */
export const createPaymentPartner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, apiKey, apiSecret, webhookUrl, supportedCurrencies, settings } = req.body;

    const paymentPartner = new PaymentPartner({
      name,
      apiKey,
      apiSecret,
      webhookUrl,
      supportedCurrencies,
      settings,
    });

    await paymentPartner.createPaymentPartner();

    res.status(201).json({
      error: false,
      message: "Payment Partner created successfully.",
      data: paymentPartner,
    });
  }
);

/**
 * @name getPaymentPartner
 * @description Retrieves a specific payment partner by its ID
 * @route GET /payment-partner/:id
 * @access  Private
 */
export const getPaymentPartner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentPartnerId = req.params.id;

    const paymentPartner = await PaymentPartner.findById(paymentPartnerId);

    if (!paymentPartner) {
      return next(new ErrorResponse("Payment Partner not found", 404, []));
    }

    res.status(200).json({
      error: false,
      message: "Payment Partner retrieved successfully.",
      data: paymentPartner,
    });
  }
);

/**
 * @name updatePaymentPartner
 * @description Updates the details of an existing payment partner
 * @route PUT /payment-partner/:id
 * @access  Private
 */
export const updatePaymentPartner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, apiKey, apiSecret, webhookUrl, supportedCurrencies, settings } = req.body;
    const paymentPartnerId = req.params.id;

    const paymentPartner = await PaymentPartner.findById(paymentPartnerId);

    if (!paymentPartner) {
      return next(new ErrorResponse("Payment Partner not found", 404, []));
    }

    const updatedData = {
      name,
      apiKey,
      apiSecret,
      webhookUrl,
      supportedCurrencies,
      settings,
    };

    await paymentPartner.updatePaymentPartner(updatedData);

    res.status(200).json({
      error: false,
      message: "Payment Partner updated successfully.",
      data: paymentPartner,
    });
  }
);

/**
 * @name getAllPaymentPartners
 * @description Retrieves all available payment partners
 * @route GET /payment-partner
 * @access  Private
 */
export const getAllPaymentPartners = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentPartners = await PaymentPartner.find();

    res.status(200).json({
      error: false,
      message: "Payment Partners retrieved successfully.",
      data: paymentPartners,
    });
  }
);
