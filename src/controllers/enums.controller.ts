import { Request, Response } from "express";

import { 
  AppChannel, 
  Carriers,
  Currency, 
  DbModels, 
  ENVType, 
  Merchants, 
  NotificationStatus, 
  OrderStatus, 
  PaymentPartners, 
  PaymentStatus, 
  Permissions, 
  ShippingStatus, 
  TokenExpiry, 
  UserType 
} from "../utils/enum.util";

/**
 * @name getEnums
 * @description Fetches and returns all enums for selection in the frontend.
 * @route GET /enums
 * @access Public
 */
export const getEnums = (req: Request, res: Response) => {
  res.status(200).json({
    error: false,
    message: "Enums retrieved successfully.",
    data: {
      ENVType,
      AppChannel,
      UserType,
      Permissions,
      DbModels,
      OrderStatus,
      ShippingStatus,
      PaymentStatus,
      NotificationStatus,
      Merchants,
      Carriers,
      TokenExpiry,
      Currency,
      PaymentPartners,
    },
  });
};
