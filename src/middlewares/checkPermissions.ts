import { Request, Response, NextFunction } from "express";
import Role from "../models/Role.model";
import ErrorResponse from "utils/error.util";

/**
 * Middleware to restrict access based on permissions
 * @param requiredPermissions Array of permissions required to access the route
 */
export const authorizePermissions = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const userRole = await Role.findById(user?.role);

    if (!userRole) {
      return next(new ErrorResponse("Role not found.", 404, []));
    }

    const hasPermission = requiredPermissions.every((perm) =>
      userRole.permissions.includes(perm)
    );

    if (!hasPermission) {
      return next(
        new ErrorResponse("Access Denied: Insufficient permissions.", 403, [])
      );
    }

    next();
  };
};
