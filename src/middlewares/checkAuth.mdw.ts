import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/error.util";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("authorization")?.split(" ")[1];

  if (!token) {
    return next(new ErrorResponse("No token provided", 401, []));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ErrorResponse("Token has expired.", 403, []));
    } else if (error instanceof jwt.JsonWebTokenError) {
      return next(new ErrorResponse("Invalid token.", 401, []));
    }

    return next(new ErrorResponse("Something went wrong.", 500, []));
  }
}

export default checkAuth;
