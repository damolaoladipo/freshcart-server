import { Request, Response, NextFunction } from "express";
import SessionService from "../services/session.service";
import { IResult } from "../utils/interface.util";

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

export const manageSession = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.sessionToken || req.session.sessionToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No session token found" });
  }

  const result: IResult = await SessionService.verifyToken(token, process.env.SESSION_SECRET as string);

  if (result.error) {
    return res.status(result.code).json({ message: result.message });
  }

  const dbCheckResult: IResult = await SessionService.checkSessionTokenInDb(token);

  if (dbCheckResult.error) {
    return res.status(dbCheckResult.code).json({ message: dbCheckResult.message });
  }

  next();
};
