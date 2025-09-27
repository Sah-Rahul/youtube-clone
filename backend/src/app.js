import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// routes imports

import userRouter from "./routes/user.routes.js";
import errorMiddleware from "./utils/error.middleware.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import healthRouter from "./routes/health.routes.js";
import likeRouter from "./routes/like.routes.js";

const app = express();

// CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/likes", likeRouter);

app.use(errorMiddleware);
export default app;
