import { Router } from "express";
import {
  loginUserHandler,
  registerUserhandler,
} from "../controllers/user.controller";

const router = Router();

router.post("/login", loginUserHandler);
router.post("/register", registerUserhandler);

export const userRouter = router;
