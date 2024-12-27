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
  
      if (req.session) {
      sessionToken = req.session.sessionToken;
  
      if (!sessionToken) {
        sessionToken = generateRandomChars(32);
        req.session.sessionToken = sessionToken;
      }
    } else {
     
      return next(
        new ErrorResponse("Server Error", 500, ["Session not initialized"])
      );
    }
  
    if (!sessionToken) {
      sessionToken = req.cookies.sessionToken;
  
      if (!sessionToken) {
        sessionToken = req.cookies.sessionToken
        res.cookie('sessionToken', sessionToken, { httpOnly: true, maxAge: 60000 });
      }
    }
  
    req.sessionToken = sessionToken;
  
    next(); 
  };