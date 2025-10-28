/**
 * imports
 */
import { Request, Response } from "express";
import { getGroqChatCompletion } from "../utils/response";
import { statusCodes } from "../config";
import Message from "../models/message.model";
/**
 * workflow :
 * 1. extracts the loged-in user's id and the prompt to be send to the chatbot.
 * 2. checks if the user id is available and the prompt is non-empty.
 * 3. checks if the query is relevant to the chatbot's role or not.
 * 4. fetches the chatbot's reply and sends it to the user.
 *
 *
 * @param req request object containing JWT token created by the logged-in user.
 * @param res response object containing chatbot response.
 * @returns promise .
 */

export const apiResponseHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.requestUser?.userId;
    const enquiry: string = req.body.enquiry;

    if (!userId || enquiry.trim() === "") {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: "Missing enquiry or user ID" });
    }

    const chatCompletion = await getGroqChatCompletion(enquiry);
    const response =
      chatCompletion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't process that.";

    if (response === "I can't help you with that topic. Sorry.") {
      return res.status(statusCodes.OK).json({ enquiry, response });
    }

    const newMessage = await Message.create({
      userId,
      enquiry,
      response,
    });

    return res.status(statusCodes.OK).json({
      enquiry,
      response,
      createdAt: newMessage.createdAt,
    });
  } catch (error) {
    console.error("Error in apiResponseHandler:", error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while processing your message",
    });
  }
};

/**
 * workflow :
 * 1. extracts the loged-in user's id.
 * 2. checks if the user id is available in the database.
 * 3. fetches the chat history of the user with the chatbot from the database.
 *
 * 
 * @param req request object containing JWT token created by the logged-in user.
 * @param res response object containing chatbot response.
 * @returns promise .
 */

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.requestUser?.userId;
    if (!userId) return res.status(400).json({ message: "User not found" });

    const messages = await Message.find({ userId })
      .sort({ createdAt: 1 })
      .populate("userId", "name")
      .select("enquiry response createdAt")
      .lean();

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ message: "Could not fetch chat history" });
  }
};
