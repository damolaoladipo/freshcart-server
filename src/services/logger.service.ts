import { Request, Response, NextFunction } from "express";
import Logger from "../utils/logger.util"; // Path to your logger
import colors from "colors";

/**
 * @name requestLogger
 * @description Middleware to log all incoming requests
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Log request details
  Logger.log({
    label: colors.bold(colors.cyan("Incoming Request")),
    data: `${req.method} ${req.url}`,
    type: "info",
  });

  // After the response is sent, log the status and duration
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    Logger.log({
      label: colors.bold(colors.cyan("Request Completed")),
      data: `Method: ${req.method}, URL: ${req.url}, Status: ${
        res.statusCode
      }, Duration: ${duration}ms`,
      type:
        res.statusCode >= 500
          ? "error"
          : res.statusCode >= 400
          ? "warning"
          : "success",
    });
  });

  next();
};
