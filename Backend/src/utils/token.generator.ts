import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../config";

export const generateRefreshToken = (
  userId: Types.ObjectId,
  email: string,
): string => {
  return jwt.sign(
    { userId, email },
    config.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRY,
    }
  );
};
