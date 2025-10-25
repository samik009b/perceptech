import "express";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      requestUser?: {
        userId: Types.ObjectId;
        email: string;
      };
    }
  }
}
