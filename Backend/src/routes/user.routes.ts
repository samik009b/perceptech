import { Router } from "express";
import {
  loginUserHandler,
  registerUserhandler,
} from "../controllers/user.controller";

const router = Router();

/**
 * @method POST
 * @description - registers the user
 * http://localhost:${PORT}/user/register
 */
router.post("/register", registerUserhandler);

/**
 * @method POST
 * @description - logs in the user
 * http://localhost:${PORT}/user/login
 */
router.post("/login", loginUserHandler);

export const userRouter = router;
