import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { Types } from "mongoose";

interface TokenPayload extends JwtPayload {
  userId: Types.ObjectId;
  email?: string;
}
const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token && req.cookies?.refreshToken) {
    token = req.cookies.refreshToken;
  }

  // DEBUG: Log the token
  console.log("Cookie refreshToken:", req.cookies?.refreshToken);
  console.log("Token being validated:", token);

  if (!token) {
    throw new Error("refresh token is not found or malformed");
  }

  try {
    const decoded = jwt.verify(
      token,
      config.REFRESH_TOKEN_SECRET as string
    ) as TokenPayload;

    if (!decoded.userId) throw new Error("token is not valid");

    req.requestUser = {
      userId: decoded.userId,
      email: decoded.email!,
    };

    next();
  } catch (error: any) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export default validateToken;
