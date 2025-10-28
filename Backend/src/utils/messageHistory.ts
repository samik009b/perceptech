import Message from "../models/message.model";
import { ChatMessage } from "../types/index";

/**
 * workflow : 
 * 
 * 1. Fetches the last 10 messages from the database and formats them 
 * into a chat-like message history (user and assistant roles).
 *
 * 
 * @returns {Promise} -  an array of chat messages, alternating between
 * user enquiries and assistant responses by sorting them from  oldest to newest.
 */
export async function getMessageHistory(): Promise<ChatMessage[]> {
  const lastTenMessages = await Message.find()
    .sort({ createdAt: 1 })
    .limit(10)
    .select("enquiry response");

  const contextMessageHistory: ChatMessage[] = [];

  lastTenMessages.forEach((msg) => {
    if (msg.enquiry && msg.enquiry.trim() !== "") {
      contextMessageHistory.push({ role: "user", content: msg.enquiry });
    }

    if (msg.response && msg.response.trim() !== "") {
      contextMessageHistory.push({ role: "assistant", content: msg.response });
    }
  });

  // return the complete formatted message history
  return contextMessageHistory;
}
