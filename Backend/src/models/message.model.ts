import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  enquiry: {
    type: String,
  },
  response: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Messages", messageSchema, "Messages");
