import { Response, NextFunction } from "express";

import ApiError from "../utils/apiError";
import { AuthRequest } from "./auth.middleware";

const authorizeRoles = (...roles: string[]) => {
  return (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You are not allowed to access this resource"
      );
    }

    next();
  };
};

export default authorizeRoles;