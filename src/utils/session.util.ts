import session from "express-session";
import { ENVType } from "./enum.util";

class SessionUtility {
  constructor() {}

  /**
   * @name getSessionSecret
   * @description Retrieves the session secret from environment variables.
   * @returns {string} - The session secret.
   * @throws {Error} - If the SESSION_SECRET is not defined.
   */
  private static getSessionSecret(): string {
    const secret = process.env.SESSION_SECRET;

    if (!secret) {
      throw new Error("SESSION_SECRET is not defined!");
    }

    return secret;
  }

  /**
   * @name configureSession
   * @description Configures the session middleware with the session secret and other parameters.
   * @returns {session.SessionOptions} - The session configuration.
   */
  public static configureSession(): session.SessionOptions {
    const secret = this.getSessionSecret();

    return {
      secret: secret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: this.isSecure() },
    };
  }

  /**
   * @name isSecure
   * @description Determines if the cookie should be secure based on the environment.
   * @returns {boolean} - `true` if secure cookies should be used (production/staging), `false` otherwise (development).
   */
  private static isSecure(): boolean {
    const environment = process.env.APP_ENV;

    return environment === ENVType.PRODUCTION || environment === ENVType.STAGING;
  }
}

export default SessionUtility;
