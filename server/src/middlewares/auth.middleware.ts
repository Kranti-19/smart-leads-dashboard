import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const protect = asyncHandler(
  async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Not authorized");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = {
      _id: String(user._id),
      role: user.role,
    };

    next();
  }
);