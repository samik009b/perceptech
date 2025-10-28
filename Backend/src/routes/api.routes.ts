import { Router } from "express";
import {
  apiResponseHandler,
  getChatHistory,
} from "../controllers/api.controller";
import validateToken from "../middlewares/token.validator";

const router = Router();

router.use(validateToken);

/**
 * @method POST
 * @description - opens the chat interface of the chatbot. 
 * http://localhost:${PORT}/api/chat
 */
router.post("/chat", apiResponseHandler);

/**
 * @method GET
 * @description - fetches chat history of the user from the database.
 * http://localhost:${PORT}/api/chat/history
 */
router.get("/chat/history", getChatHistory);

export const apiRouter = router;
