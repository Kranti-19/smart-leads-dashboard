import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { getCurrentUser } from "../controllers/auth.controller";

import {
  registerUser,
  loginUser,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getCurrentUser);

export default router;