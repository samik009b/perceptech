import { Schema, model } from "mongoose";
import { IMessage } from "../types";

const messageSchema = new Schema<IMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  enquiry: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model<IMessage>("Messages", messageSchema, "Messages");
