import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import Notification from "../models/Notification.model";

/**
 * @name getNotifications
 * @description Retrieves all notifications for a user
 * @route GET /notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId });

    if (!notifications || notifications.length === 0) {
      return next(new ErrorResponse("No notifications found", 404, []));
    }

    res.status(200).json({
      error: false,
      message: "Notifications retrieved successfully.",
      data: notifications,
    });
  }
);

/**
 * @name createNotification
 * @description Creates a new notification for a user
 * @route POST /notifications
 * @access  Private
 */
export const createNotification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, message } = req.body;

    const notification = new Notification({
      user: userId,
      message,
      status: "unread",
    });

    await notification.save();

    res.status(201).json({
      error: false,
      message: "Notification created successfully.",
      data: notification,
    });
  }
);

/**
 * @name markAsRead
 * @description Marks a notification as read
 * @route PUT /notifications/:notificationId/read
 * @access  Private
 */
export const markAsRead = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return next(new ErrorResponse("Notification not found", 404 , []));
    }

    await notification.readNotification();

    res.status(200).json({
      error: false,
      message: "Notification marked as read successfully.",
      data: notification,
    });
  }
);

/**
 * @name deleteNotification
 * @description Deletes a notification for a user
 * @route DELETE /notifications/:notificationId
 * @access  Private
 */
export const deleteNotification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return next(new ErrorResponse("Notification not found", 404 , []));
    }

    await notification.removeNotification();

    res.status(200).json({
      error: false,
      message: "Notification deleted successfully.",
      data: {},
    });
  }
);
