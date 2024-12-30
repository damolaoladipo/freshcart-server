import crypto from 'crypto';
import SessionToken from '../models/sessionToken.model';
import { Request, Response, NextFunction } from "express";
import { generateRandomChars } from "../utils/helper.util";
import User from '../models/User.model';
import { IResult } from '../utils/interface.util';

class SessionService {
  constructor() {}

  /**
   * @name generateSessionToken
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async generateSessionToken(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    let sessionToken =  req.cookies?.sessionToken || req.session?.sessionToken;

    if (req.session) {
      sessionToken = req.session.sessionToken;

      if (!sessionToken) {
        sessionToken = generateRandomChars(32);
        req.session.sessionToken = sessionToken;
      }
    } else {
      result.error = true;
      result.message = "Session not initialized";
      result.code = 500;
      return result;
    }

    if (!sessionToken) {
      sessionToken = req.cookies.sessionToken;

      if (!sessionToken) {
        sessionToken = generateRandomChars(32);
        res.cookie('sessionToken', sessionToken, { httpOnly: true, maxAge: 60000 });
      }
    }

    req.sessionToken = sessionToken;

    result.error = false;
    result.message = "Session token created";
    result.code = 200;
    result.data = { sessionToken: sessionToken };

    return result;
  }

  /**
   * @name createSessionToken
   * @param req - The request object
   * @param res - The response object
   * @param next - The next middleware function
   * @returns { Promise<IResult> } - see IResult
   */
  public async createSessionToken(req: Request, res: Response, next: NextFunction): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    let sessionToken = req.cookies.sessionToken || req.session.sessionToken;
    const { userId } = req.body;

    if (!sessionToken) {
      result.error = true;
      result.message = "Session token is required";
      result.code = 400;
      return result;
    }

    const existingToken = await SessionToken.findOne({ token: sessionToken });

    if (!existingToken) {
      result.error = true;
      result.message = "Session token is invalid or has expired";
      result.code = 403;
      res.status(result.code).json(result);
      return result;
    }

    const user = await User.findById(userId);

    if (!user) {
      result.error = true;
      result.message = "User not found";
      result.code = 404;
      return result;
    }

    const payload = JSON.stringify({
      userId,
      exp: Math.floor(Date.now() / 1000) + 3600
    });

    const hmac = crypto.createHmac('sha256', process.env.SESSION_SECRET as string);
    hmac.update(payload);
    const hmacHash = hmac.digest('hex');

    const token = `${JSON.stringify(payload)}.${hmacHash}`;

    existingToken.token = token;
    await existingToken.save();

    req.sessionToken = token;
    res.cookie('sessionToken', token, {
      httpOnly: true,
      maxAge: 60000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    result.error = false;
    result.message = "Session token created successfully";
    result.code = 200;
    result.data = { sessionToken: token };
    
    return result;
  }

  /**
   * @name verifyToken
   * @param token - The session token to verify
   * @param secret - The secret key used to verify the token's HMAC
   * @returns { Promise<IResult> } - see IResult
   */
  public async verifyToken(token: string, secret: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const [payloadString, hmacHash] = token.split('.');

    if (!payloadString || !hmacHash) {
      result.error = true;
      result.message = "Invalid session token structure";
      result.code = 400;
      return result;
    }

    if (!this.verifyHmac(payloadString, hmacHash, secret)) {
      result.error = true;
      result.message = "HMAC verification failed";
      result.code = 400;
      return result;
    }

    const payload = JSON.parse(payloadString);
    if (this.isTokenExpired(payload)) {
      result.error = true;
      result.message = "Session token has expired";
      result.code = 400;
      return result;
    }

    result.error = false;
    result.message = "Session token is valid";
    result.data = payload;
    return result;
  }

  private verifyHmac(payloadString: string, hmacHash: string, secret: string): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payloadString as string);
    const recalculatedHmac = hmac.digest('hex');
    return recalculatedHmac === hmacHash;
  }

  private isTokenExpired(payload: { exp: number }): boolean {
    return payload.exp < Math.floor(Date.now() / 1000);
  }

  /**
   * @name checkSessionTokenInDb
   * @param token - The session token to check
   * @returns { Promise<IResult> } - see IResult
   */
  public async checkSessionTokenInDb(token: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    const [payloadString, hmacHash] = token.split('.');

    if (!payloadString || !hmacHash) {
      result.error = true;
      result.message = "Invalid session token structure";
      result.code = 400;
      return result;
    }

    const tokenHash = crypto.createHmac('sha256', process.env.SESSION_SECRET as string)
      .update(token as string)
      .digest('hex');

    const existingToken = await SessionToken.findOne({ token: tokenHash });

    if (!existingToken) {
      result.error = true;
      result.message = "Session token is invalid or has expired";
      result.code = 403;
      return result;
    }

    result.error = false;
    result.message = "Session token exists in the database";
    result.data = existingToken;
    return result;
  }
}

export default new SessionService();
