import { Request, Response } from "express";
import { getGroqChatCompletion } from "../utils/response";
import { statusCodes } from "../config";
import Message from "../models/message.model";

export const apiResponseHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.requestUser?.userId; // assuming middleware attaches this
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
