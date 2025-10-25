import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes";
import { apiRouter } from "./routes/api.routes";
// In your backend Express app
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // CRITICAL: Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/api", apiRouter);

export default app;
