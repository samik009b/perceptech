import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { Types } from "mongoose";

interface TokenPayload extends JwtPayload {
  userId: Types.ObjectId;
  email?: string;
}

/**
 * workflow :
 * 1. checks if there are any tokens in the authorization header or cookie.
 * 2. if it exists then it is verified by matching with the token secret.
 * 3. if the token is valid then the payload is decoded and sent as reqUser.
 * 4. now then next function can access the payload.
 * 
 * 
 * @param req request object that contains the token created by the user while logging in.
 * @param res response object containing message to the user and http status codes.
 * @param next nextFunction object to call the next function / middleware.
 * @returns promise
 */
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
