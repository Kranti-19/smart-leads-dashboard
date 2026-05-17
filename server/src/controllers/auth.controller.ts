import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user.model";

import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import generateToken from "../utils/generateToken";
import { AuthRequest } from "../middlewares/auth.middleware";

import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation";

export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = registerSchema.parse(req.body);

    const { name, email, password, role } = validatedData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: "User registered successfully",

      data: {
        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Login successful",

      data: {
        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  }
);

export const getCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await User.findById(req.user?._id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);