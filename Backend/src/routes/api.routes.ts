import { Router } from "express";
import {
  apiResponseHandler,
  getChatHistory,
} from "../controllers/api.controller";
import validateToken from "../middlewares/token.validator";

const router = Router();

router.use(validateToken);

router.post("/chat", apiResponseHandler);
router.get("/chat/history", getChatHistory);

export const apiRouter = router;
