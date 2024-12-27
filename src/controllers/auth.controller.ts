import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import User from "../models/User.model";
import authMappers from "../mappers/auth.mappers";
import AuthService from "../services/auth.service";
import userService from "../services/user.service";
import { RegisterDTO } from "../dtos/auth.dto";

import { generateRandomChars } from "../utils/helper.util";
import { UserType } from "../utils/enum.util";

/**
 * @name register
 * @description Registers a new user for the application
 * @route POST /auth/register
 * @access  Public
 */
export const register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if(req.body.email) {
        req.body.email = req.body.email.toLowerCase();
      }
      const { email, password, firstName, lastName } = req.body as RegisterDTO;
      const validate = await AuthService.validateRegister(req.body);
  
      if (validate.error) {
        return next(
          new ErrorResponse("Error", validate.code!, [validate.message])
        );
      }
  
      const existUser = await User.findOne({ email });
  
      if (existUser) {
        return next(
          new ErrorResponse("Error", 403, [
            "user already exists, use another email",
          ])
        );
      }

      let username = req.session.sessionToken;

      if (!username) {
        username = generateRandomChars(24);
      }
  
      const user = await userService.createUser({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          userType: UserType.USER,
          role: UserType.USER,
          isUser: true,
          isGuest: false,
          isSuper: false,
          isAdmin: false,
          isMerchant: false
      });
  
      const mapped = await authMappers.mapRegisteredUser(user);

      res.status(200).json({
        error: false,
        errors: [],
        data: mapped,
        message:
          "User registered successfully.",
        status: 200,
      });
    }
  );


  /**
 * @name login
 * @description logs a user in
 * @route POST /auth/login
 * @access  Public
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    if(req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }

    const validate = await AuthService.validateLogin(req.body);

    if (validate.error) {
      return next(
        new ErrorResponse("Error", validate.code!, [validate.message])
      );
    }

    // Check if there is an existing refresh token for this user
    const existingToken = await RefreshToken.findOne({
      userId: validate.data.id,
    });

    if (existingToken) {
      // Replace the old refresh token with the new one
      existingToken.token = validate.data.refreshToken;
      await existingToken.save();
    } else {
      // Create a new refresh token record if none exists
      await RefreshToken.create({
        token: validate.data.refreshToken,
        userId: validate.data.id,
      });
    }

    // Update the user's lastLogin timestamp
    const lastLogin = new Date();
    await User.findByIdAndUpdate(validate.data.id, {
      lastLogin,
    });

    // Set the refresh token in an httpOnly cookie
    res.cookie("refreshToken", validate.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds TODO: Transfer to env
    });

    const mappedData = await authMapper.mapRegisteredUser(validate.data);

    res.status(200).json({
      error: false,
      errors: [],
      data: { ...mappedData, lastLogin, authToken: validate.data.authToken },
      message: "User login successful",
      status: 200,
    });
  }
);
