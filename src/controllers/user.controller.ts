import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import User from "../models/User.model";

/**
 * @name getUser
 * @description Retrieves user information excluding email, password, and permission settings
 * @route GET /user
 * @access  Private
 */
export const getUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user.id;
  
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorResponse("Error", 404, ["User  not found"]));
      }
  
     
      const userInfo = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        phoneCode: user.phoneCode,
        countryPhone: user.countryPhone,
      };
  
      res.status(200).json({
        error: false,
        errors: [],
        data: userInfo,
        message: "User information retrieved successfully.",
        status: 200,
      });
    }
  );


  /**
 * @name editUser
 * @description Edits user information excluding email, password, and permission settings
 * @route PUT /user
 * @access  Private
 */
export const editUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user.id; 
      const {
        username,
        firstName,
        lastName,
        phoneNumber,
        phoneCode,
        countryPhone,
      } = req.body; 
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorResponse("Error", 404, ["User  not found"]));
      }
  
      // Update user information
      user.firstName = firstName || user.firstName;
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.phoneCode = phoneCode || user.phoneCode;
      user.countryPhone = countryPhone || user.countryPhone;
  
      await user.save();
  
      const mapped = await authMapper.mapRegisteredUser(user);
  
      res.status(201).json({
        error: false,
        errors: [],
        data: mapped,
        message: "User information updated successfully.",
        status: 201,
      });
    }
  );
  
  