/**
 * imports
 */
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { statusCodes } from "../config";
import User from "../models/user.model";
import { logger } from "../utils/logger";
import { IUser } from "../types";
import { generateRefreshToken } from "../utils/token.generator";
import { config } from "../config";
import { Types } from "mongoose";

type userData = Pick<IUser, "email" | "name" | "password">;

/**
 * workflow :
 * 1. user first provides their name, unique email and password.
 * 2. validates that all fields are non-empty.
 * 3. checks whether usr already exists with the same email id.
 * 4. if not, creates a new user document in database.
 * 5. logs success or error events accordingly and sends the appropriate http response.
 *
 *
 * @param req - request object containing user data for registration.
 * @param res - response object containign http status code and user data.
 * @returns promise.
 */
export const registerUserhandler = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as userData;

  if ([name, email, password].some((field) => field.trim() === "")) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ message: "all fields are required" });
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ message: "user already exists with this email" });
  }

  User.create({
    name,
    email,
    password,
  })
    .then((newUser) => {
      logger.info("new user registered", {
        name: newUser.name,
        email: newUser.email,
      });
      return res
        .status(statusCodes.CREATED)
        .json({ message: "new user has been created" });
    })
    .catch((error) => {
      logger.error("error while creating new user");
      throw new Error(error);
    });
};

/**
 * workflow :
 * 1. user first provides their email and password.
 * 2. checks if user does exist with the provided email in database.
 * 3. if exist then match the hashed passwords.
 * 4. if password matches, a JWT token and a cookie is created with the email and id as payload.
 * 5. logs success or error events accordingly and sends the appropriate http response.
 * 
 * 
 * @param req - request object containing user data for logging in.
 * @param res - response object containign http status code and user data.
 * @returns promise.
 */
export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as userData;

    const user = await User.findOne({ email }).select("-__v").exec();
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        message: "user not found, please register first.",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!isPasswordMatched) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        message: "invalid password",
      });
    }

    const refreshToken = generateRefreshToken(
      user._id as Types.ObjectId,
      user.email
    );

    const safeUser = {
      id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: config.NODE_ENV === "production",
    });

    logger.info(`${safeUser.email} just logged in`);

    return res.status(statusCodes.OK).json({
      message: "user logged in successfully",
      user: safeUser,
    });
  } catch (error: any) {
    logger.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "something went wrong during login",
    });
  }
};
