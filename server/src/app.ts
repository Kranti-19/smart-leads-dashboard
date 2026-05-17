import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Leads API Running",
  });
});

app.get("/error", () => {
  throw new Error("Test error");
});

app.use("/api/auth", authRoutes);

app.use("/api/leads", leadRoutes);

app.use(errorMiddleware);

export default app;