import crypto from "crypto";
import Token from "../models/Token.model";
import User from "../models/User.model";
import { IResult, ITokenPayload } from "../utils/interface.util";

class TokenService {
  constructor() {}

  /**
   * @name generateToken
   * @description Generate a token with HMAC and payload
   * @param payload - Data to include in the token
   * @param secret - Secret key for signing
   * @returns {string} - Generated token
   */
  public generateToken(payload: object, secret: string, expiresIn?: number): string {
    const tokenPayload = { 
        ...payload,
        ...(expiresIn ? { exp: Math.floor(Date.now() / 1000) + expiresIn } : {}), // Add expiration time if provided
      };
  
    const payloadString = JSON.stringify(tokenPayload);
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(payloadString);
    const signature = hmac.digest("hex");
    
    return `${Buffer.from(payloadString).toString("base64")}.${signature}`;
  }

  /**
   * @name verifyToken
   * @description Verify a token's integrity and expiration
   * @param token - Token to verify
   * @param secret - Secret key for verification
   * @returns {object | null} - Decoded payload if valid, otherwise null
   */
  public verifyToken(token: string, secret: string): ITokenPayload | null {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;
  
    const payloadString = Buffer.from(encodedPayload, "base64").toString("utf-8");
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(payloadString);
    const recalculatedSignature = hmac.digest("hex");
  
    if (recalculatedSignature !== signature) return null;
  
    const payload: ITokenPayload = JSON.parse(payloadString);
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  
    return payload;
  }
  

  /**
   * @name createToken
   * @description Generate and save a token for a user
   * @param userId - User's ID
   * @returns {Promise<IResult>} - Token creation result
   */
  public async createToken(userId: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const user = await User.findById(userId);
    if (!user) {
      result.error = true;
      result.message = "User not found";
      result.code = 404;
      return result;
    }

    const payload = {
      userId,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1-hour expiration
    };

    const token = this.generateToken(payload, process.env.TOKEN_SECRET as string);

    const userToken = new Token({ 
      user: user._id, 
      token,
      expiresAt: new Date(Date.now() + 3600 * 1000) });
    await userToken.save();

    result.data = { token };
    result.message = "Token created successfully";
    return result;
  }

  /**
   * @name validateToken
   * @description Validate a token and attach user data
   * @param token - Token to validate
   * @returns {Promise<IResult>} - Token validation result
   */
  public async validateToken(token: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
  
    const payload = this.verifyToken(token, process.env.TOKEN_SECRET as string);
    if (!payload) {
      result.error = true;
      result.message = "Invalid or expired token";
      result.code = 401;
      return result;
    }
  
    const user = await User.findById(payload.userId);
    if (!user) {
      result.error = true;
      result.message = "User not found";
      result.code = 404;
      return result;
    }
  
    result.data = { user };
    result.message = "Token validated successfully";
    return result;
  }
  

  /**
   * @name revokeToken
   * @description Revoke a user's token
   * @param token - Token to revoke
   * @returns {Promise<IResult>} - Token revocation result
   */
  public async revokeToken(token: string): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    const existingToken = await Token.findOneAndDelete({ token });
    if (!existingToken) {
      result.error = true;
      result.message = "Token not found";
      result.code = 404;
      return result;
    }

    result.message = "Token revoked successfully";
    return result;
  }
}

export default new TokenService();
