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

      let username = req.session.token;

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