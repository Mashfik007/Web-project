import mongoose from "mongoose";

const Message_schema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: [true, "conversation is required"],
      trim: true,
      index: true,
    },
    senderId: {
      type: String,
      required: [true, "sender is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "message is required"],
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true },
);

const Message =
  mongoose.models.messages || mongoose.model("messages", Message_schema);

export { Message, Message_schema };
