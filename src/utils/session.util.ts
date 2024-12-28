import crypto from 'crypto';
import SessionToken from '../models/sessionToken.model';
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/error.util";
import { generateRandomChars } from "../utils/helper.util";
import User from '../models/User.model';
 

/**
 * Generate session for the user (without user ID on initial visit)
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export const generateSessionToken = (req: Request, res: Response, next: NextFunction) => {
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
      sessionToken = generateRandomChars(32); 
      res.cookie('sessionToken', sessionToken, { httpOnly: true, maxAge: 60000 });
    }
  }

    res.json({
    success: true,
    message: 'Session token created',
    sessionToken: sessionToken
  });

  req.sessionToken = sessionToken; 
  next(); 
};


/**
 * Creates a session token for the user, includes the userId in the payload.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export const createSessionToken = async (req: Request, res: Response, next: NextFunction) => {
    let sessionToken = req.cookies.sessionToken || req.session.sessionToken;
    const { userId } = req.body; 

  
    if (!sessionToken) {
        return next(new ErrorResponse("Session token is required", 400, ["Session token is required"]));
    }

    const existingToken = await SessionToken.findOne({ token: sessionToken });

    if (!existingToken) {
      return res.status(403).json({
        message: "Session token is invalid or has expired",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorResponse("User not found", 404, []));
      }

 
    const payload = JSON.stringify({
        userId, 
        exp: Math.floor(Date.now() / 1000) + 3600 
    });

    const hmac = crypto.createHmac('sha256', process.env.SESSION_SECRET as string);
    hmac.update(payload);
    const hmacHash = hmac.digest('hex');

    const token = `${JSON.stringify(payload)}.${hmacHash}`

    existingToken.token = token;
    await existingToken.save();
    
    req.sessionToken = token; 
    res.cookie('sessionToken', token, { 
        httpOnly: true, 
        maxAge: 60000, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    next(); 
  };


/**
 * Verifies the session token by checking its HMAC, expiration, and integrity.
 * @param token - The session token to verify
 * @param secret - The secret key used to verify the token's HMAC
 * @returns {boolean} - Returns true if the token is valid, otherwise false
 */
export const verifyToken = (token: string, secret: string) => {
    const [payloadString, hmacHash] = token.split('.');
  
    if (!payloadString || !hmacHash) {
      return false;
    }
  
    if (!verifyHmac(payloadString, hmacHash, secret)) {
      return false; 
    }

    const payload = JSON.parse(payloadString);
    if (isTokenExpired(payload)) {
      return false; 
    }
    
      return true;
}

const verifyHmac = (payloadString: string, hmacHash: string, secret: string): boolean => {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payloadString);
    const recalculatedHmac = hmac.digest('hex');
    return recalculatedHmac === hmacHash;
  };
  
  
  const isTokenExpired = (payload: { exp: number }): boolean => {
    return payload.exp < Math.floor(Date.now() / 1000); 
  };


/**
 * Checks if the session token exists in the database and verifies its integrity.
 * @param token - The session token to check
 * @returns {Promise<any>} - Returns the existing session token from the database
 */
export const checkSessionTokenInDb = async (token: string) => {

    const [payloadString, hmacHash] = token.split('.');

    if (!payloadString || !hmacHash) {
      throw new Error("Invalid session token structure");
    }

    const tokenHash = crypto.createHmac('sha256', process.env.SESSION_SECRET as string)
      .update(token)
      .digest('hex');
  
    const existingToken = await SessionToken.findOne({ token: tokenHash });
  
    if (!existingToken) {
      throw new Error("Session token is invalid or has expired");
    }
  
    return existingToken; 
  };
  
      