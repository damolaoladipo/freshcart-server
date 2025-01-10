import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import User from "../models/User.model";
import authMapper from "../mappers/auth.mapper";
import AuthService from "../services/auth.service";
import userService from "../services/user.service";
import { RegisterDTO } from "../dtos/auth.dto";
import { UserType } from "../utils/enum.util";
import { generateRandomChars } from "../utils/helper.util";
import Token from "../models/Token.model";
import tokenService from "../services/token.service";
import emailService from "../services/email.service";

/**
 * @name register
 * @description Registers a new user for the application and associate the session token
 * @route POST /auth/register
 * @access  Public
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body as RegisterDTO;

    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
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
          "User already exists, use another email",
        ])
      );
    }

    const username = generateRandomChars(24);

    const user = await userService.createUser({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      username: username,
      userType: UserType.USER,
      role: UserType.USER,
      isUser: true,
      isGuest: false,
      isSuper: false,
      isAdmin: false,
      isMerchant: false,
    });

    const mapped = await authMapper.mapRegisteredUser(user);

    res.status(200).json({
      error: false,
      errors: [],
      data: mapped,
      message: "User registered successfully.",
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
   
    if (!req.body.email || !req.body.password) {
      return next(new ErrorResponse("Email and password are required", 400, []));
    } req.body.email = req.body.email.toLowerCase();

    const validate = await AuthService.validateLogin(req.body);
    if (validate.error) {
      return next(
        new ErrorResponse("Error", validate.code!, [validate.message])
      );
    }

    const authToken = await Token.findOne({
      userId: validate.data.id,
    });

    if (authToken) {
      authToken.token = validate.data.token;
      await authToken.save();
    } else {
      

      if (!validate.data.token) {
        return next(new ErrorResponse("Token generation failed", 500, []));
      }

      await Token.create({
        token: validate.data.token,
        userId: validate.data.id,
      });
    }

    const user = await User.findOne({ _id: validate.data.id });
    if (!user) {
      return next(new ErrorResponse("User not found", 404, []));
    }

    const mappedData = await authMapper.mapRegisteredUser(validate.data);

    res.status(200).json({
      error: false,
      errors: [],
      data: { ...mappedData, authToken: validate.data.token },
      message: "User login successful",
      status: 200,
    });
  }
);

/**
 * Generate session for the user (without user ID on initial visit)
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
// export const generateSessionToken = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = await SessionService.generateSessionToken(req, res, next);
//     if (result.error) {
//       return next(new ErrorResponse("Error", result.code, [result.message]));
//     }

//     res.status(200).json({
//       error: false,
//       errors: [],
//       data: { sessionToken: result.data.sessionToken },
//       message: "Session token created successfully",
//       status: 200,
//     });
//   }
// );

/**
 * Creates a session token for the user, includes the userId in the payload.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
// export const createSessionToken = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { sessionToken, userId } = req.body;

//     if (!sessionToken) {
//       return next(
//         new ErrorResponse("Session token is required", 400, [
//           "Session token is required",
//         ])
//       );
//     }

//     const result = await SessionService.createSessionToken(req, res, next);
//     if (result.error) {
//       return next(new ErrorResponse("Error", result.code, [result.message]));
//     }

//     res.status(200).json({
//       error: false,
//       errors: [],
//       data: { sessionToken: result.data.sessionToken },
//       message: "Session token refreshed successfully",
//       status: 200,
//     });
//   }
// );

/**
 * @name logout
 * @description Logs out the user by invalidating the session token
 * @route POST /auth/logout
 * @access Public
 */
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      error: false,
      errors: [],
      message: "User logged out successfully.",
      status: 200,
    });
  }
);
// export const logout = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { sessionToken } = req.cookies;

//   if (!sessionToken) {
//     return next(
//       new ErrorResponse("Session token is missing", 400, [
//         "Session token is required",
//       ])
//     );
//   }

//   const session = await SessionToken.findOne({ token: sessionToken });
//   if (!session) {
//     return next(
//       new ErrorResponse("Session token not found", 403, [
//         "Session token not found or expired",
//       ])
//     );
//   }

//   await session.removeSession();

//   res.clearCookie("sessionToken", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });

//   req.session.destroy((err) => {
//     if (err) {
//       return next(
//         new ErrorResponse("Failed to destroy session", 500, [
//           "Server error occurred while logging out",
//         ])
//       );
//     }

//     return res.status(200).json({
//       error: false,
//       errors: [],
//       message: "User logged out successfully.",
//       status: 200,
//     });
//   });
// };

/**
 * @name forgotPassword
 * @description Allows user request to a link to reset their password
 * @route POST /auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!emailService.validateEmail(email)) {
      return next(new ErrorResponse("Invalid email format.", 400, []));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("User with this email does not exist.", 404, []));
    }

    const resetToken = tokenService.generateToken(
      { userId: user._id, type: 'forgotPassword' }, 
      process.env.TOKEN_SECRET as string, 900
    ); 

    await Token.create({ userId: user._id, token: resetToken });

    const resetUrl = `${process.env.CLIENT_URL}/forgot-password?token=${resetToken}&id=${user._id}`;

    const emailResult = await emailService.sendPasswordForgotEmail(user.email, resetUrl);
    if (emailResult.error) {
      return next(new ErrorResponse(emailResult.message, emailResult.code, []));
    }

    res.status(200).json({
      error: false,
      errors: [],
      data: {},
      message: "Forgot Password link sent to your email",
      status: 200,
    });
  }
);

/**
 * @name changePassword
 * @description Allows user to change their password using their old password
 * @route POST /auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorResponse("User not found", 404, []));
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return next(new ErrorResponse("Old password is incorrect", 400, []));
    }

    if (!userService.checkPassword(newPassword)) {
      return next(
        new ErrorResponse(
          "password must contain, 1 uppercase letter, one special character, one number and must be greater than 8 characters",
          400,
          []
        )
      );
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      error: false,
      errors: [],
      data: {},
      message: "Password changed successfully",
      status: 200,
    });
  }
);
