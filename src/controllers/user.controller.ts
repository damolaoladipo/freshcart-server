import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import User from "../models/User.model";
import authMappers from "../mappers/auth.mapper";

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
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        phoneCode: user.phoneCode,
        countryPhone: user.countryPhone,
        address: user.address,
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
        firstName,
        lastName,
        username,
        avatar,
        phoneNumber,
        phoneCode,
        countryPhone,
        address,
      } = req.body; 
  
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorResponse("Error", 404, ["User  not found"]));
      }
  
      user.firstName = firstName || user.firstName;
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.avatar = avatar || user.avatar;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.phoneCode = phoneCode || user.phoneCode;
      user.countryPhone = countryPhone || user.countryPhone;

      if (address) {
        user.address = user.address.map((addr, index) => {
          const newAddress = address[index];
          return {
            street: newAddress?.street || addr.street,
            city: newAddress?.city || addr.city,
            state: newAddress?.state || addr.state,
            postalCode: newAddress?.postalCode || addr.postalCode,
            country: newAddress?.country || addr.country,
          };
        });
      } 
  
      await user.save();
  
      const mapped = await authMappers.mapRegisteredUser(user);
  
      res.status(201).json({
        error: false,
        errors: [],
        data: mapped,
        message: "User information updated successfully.",
        status: 201,
      });
    }
  );
  
/**
 * @name getAllUsers
 * @description Retrieves a list of all users excluding sensitive information like email, password, and permissions.
 * @route GET /users
 * @access Private (Admin or higher-level roles)
 */
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
      
      if (!req.user.isAdmin && !req.user.isSuper) {
        return next(new ErrorResponse("Unauthorized access", 403, []));
      }

      const users = await User.find({}, "-password -emailCode -role.permissions");

      const userData = users.map((user) => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        phoneCode: user.phoneCode,
        countryPhone: user.countryPhone,
        address: user.address,
        accountStatus: user.accountStatus,
        isSuper: user.isSuper,
        isAdmin: user.isAdmin,
        isMerchant: user.isMerchant,
        isUser: user.isUser,
      }));

      res.status(200).json({
        error: false,
        errors: [],
        data: userData,
        message: "Users retrieved successfully.",
        status: 200,
      });
  }
);
