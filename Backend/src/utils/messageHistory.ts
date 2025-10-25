import Message from "../models/message.model";
import { ChatMessage } from "../types/index";

export async function getMessageHistory(): Promise<ChatMessage[]> {
  const lastTenMessages = await Message.find()
    .sort({ createdAt: 1 }) // oldest first
    .limit(10)
    .select("enquiry response")
    .lean();

  const contextMessageHistory: ChatMessage[] = [];

  lastTenMessages.forEach((msg) => {
    if (msg.enquiry && msg.enquiry.trim() !== "") {
      contextMessageHistory.push({ role: "user", content: msg.enquiry });
    }
    if (msg.response && msg.response.trim() !== "") {
      contextMessageHistory.push({ role: "assistant", content: msg.response });
    }
  });

  return contextMessageHistory;
}
