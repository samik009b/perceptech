import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../config";

/**
 * @description - generates refreshToken for the user to create sessions.
 * 
 * 
 * @param userId generated in the databse by mongoDB for each user.
 * @param email given by the user while registering.
 * @returns {promise} - a JWT token with userId and email as payload
 */
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
