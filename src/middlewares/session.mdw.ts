import { Request, Response, NextFunction } from "express";
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import session,  { SessionData } from 'express-session';
import ErrorResponse from "../utils/error.util";
import { generateRandomChars } from "../utils/helper.util";

declare global {
    namespace Express {
      interface Request {
        sessionToken?: string; 
      }
    }
  }

declare module "express-session" {
    interface SessionData {
      sessionToken?: string;
    }
  }

export const manageSession = (req: Request, res: Response, next: NextFunction) => {
    let sessionToken;
  
    // Check if the session object exists
    if (req.session) {
      sessionToken = req.session.sessionToken;
  
      // If no session token, generate a new one and store it in the session
      if (!sessionToken) {
        sessionToken = generateRandomChars(32);
        req.session.sessionToken = sessionToken;
      }
    } else {
      // Handle the case where session middleware is not initialized
      return next(
        new ErrorResponse("Server Error", 500, ["Session not initialized"])
      );
    }
  
    // Check if there is a session token in the cookies
    if (!sessionToken) {
      sessionToken = req.cookies.sessionToken;
  
      // If no session token in cookies, generate a new one and set it in the cookies
      if (!sessionToken) {
        sessionToken = generateRandomChars(32);
        res.cookie('sessionToken', sessionToken, { httpOnly: true, maxAge: 60000 });
      }
    }
  
    // Set the session token in the request object
    req.sessionToken = sessionToken;
  
    next(); // Proceed to the next middleware or route handler
  };