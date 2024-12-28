import { Request, Response, NextFunction } from "express";
import { checkSessionTokenInDb, verifyToken } from "../utils/session.util";

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

export const manageSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.sessionToken || req.session.sessionToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No session token found" });
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No session token found" });
  }
  
  const isTokenValid = await verifyToken(
    token,
    process.env.SESSION_SECRET as string
  );

  if (!isTokenValid) {
    return res
      .status(403)
      .json({ message: "Invalid or expired session token" });
  }

  await checkSessionTokenInDb(token);

  next(); 
};
