import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/async.mdw";
import ErrorResponse from "../utils/error.util";
import User from "../models/User.model";
import authMapper from "../mappers/auth.mapper";
import AuthService from "../services/auth.service";
import userService from "../services/user.service";
import { RegisterDTO } from "../dtos/auth.dto";
import { UserType } from "../utils/enum.util";
import SessionToken from "../models/sessionToken.model";
import SessionService from "../services/session.service"; // Import SessionService
import { generateRandomChars } from "../utils/helper.util";

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

        const { sessionToken } = req.cookies;
        
        if (!sessionToken) {
            const validateSession = await SessionService.generateSessionToken(req, res, next);
            if (validateSession.error) {
                return next(new ErrorResponse("Session token is missing", 400, [validateSession.message]));
            }
            return next(new ErrorResponse("Session token is missing", 400, ["Session token is required"]));
        }
    
        const validSession = await SessionService.verifyToken(sessionToken, process.env.SESSION_SECRET as string);
        if (validSession.error) {
            return next(new ErrorResponse("Session token is invalid", 403, [validSession.message]));
        }

        const existingSession = await SessionToken.findOne({ token: sessionToken });
        if (!existingSession) {
            return next(new ErrorResponse("Session token has expired", 403, []));
        }

        const validate = await AuthService.validateRegister(req.body);
        if (validate.error) {
            return next(new ErrorResponse("Error", validate.code!, [validate.message]));
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return next(new ErrorResponse("Error", 403, ["User already exists, use another email"]));
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
            isMerchant: false
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
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase();
        }

        const validate = await AuthService.validateLogin(req.body);
        if (validate.error) {
            return next(new ErrorResponse("Error", validate.code!, [validate.message]));
        }

        const existingToken = await SessionToken.findOne({ userId: validate.data.id });

        if (existingToken) {
            existingToken.token = validate.data.SessionToken;
            await existingToken.save();
        } else {
            await SessionToken.create({
                token: validate.data.SessionToken,
                userId: validate.data.id,
            });
        }

        const user = await User.findOne({ _id: validate.data.id });
        if (!user) {
            return next(new ErrorResponse("User not found", 404, []));
        }

        const lastLogin = new Date();
        await User.findByIdAndUpdate(validate.data.id, { lastLogin });

        res.cookie("sessionToken", validate.data.SessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, 
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

/**
 * Generate session for the user (without user ID on initial visit)
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export const generateSessionToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await SessionService.generateSessionToken(req, res, next);
        if (result.error) {
            return next(new ErrorResponse("Error", result.code, [result.message]));
        }

        res.status(200).json({
            error: false,
            errors: [],
            data: { sessionToken: result.data.sessionToken },
            message: "Session token created successfully",
            status: 200,
        });
    }
);

/**
 * Creates a session token for the user, includes the userId in the payload.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export const createSessionToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { sessionToken, userId } = req.body;
        
        if (!sessionToken) {
            return next(new ErrorResponse("Session token is required", 400, ["Session token is required"]));
        }

        const result = await SessionService.createSessionToken(req, res, next);
        if (result.error) {
            return next(new ErrorResponse("Error", result.code, [result.message]));
        }

        res.status(200).json({
            error: false,
            errors: [],
            data: { sessionToken: result.data.sessionToken },
            message: "Session token refreshed successfully",
            status: 200,
        });
    }
);

/**
 * @name logout
 * @description Logs out the user by invalidating the session token
 * @route POST /auth/logout
 * @access Public
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    const { sessionToken } = req.cookies;

    if (!sessionToken) {
        return next(new ErrorResponse("Session token is missing", 400, ["Session token is required"]));
    }

    const session = await SessionToken.findOne({ token: sessionToken });
    if (!session) {
        return next(new ErrorResponse("Session token not found", 403, ["Session token not found or expired"]));
    }

    await session.removeSession();

    res.clearCookie('sessionToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    req.session.destroy((err) => {
        if (err) {
            return next(new ErrorResponse("Failed to destroy session", 500, ["Server error occurred while logging out"]));
        }

        return res.status(200).json({
            error: false,
            errors: [],
            message: "User logged out successfully.",
            status: 200,
        });
    });
};
