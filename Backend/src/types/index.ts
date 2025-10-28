import { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface IMessage {
  userId: Types.ObjectId;
  enquiry: string;
  response: string;
  createdAt: Date;
}

// types.ts
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
