import mongoose from "mongoose";

const ChatRead_schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "user is required"],
      trim: true,
    },
    conversationId: {
      type: String,
      required: [true, "conversation is required"],
      trim: true,
    },
    lastReadAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

ChatRead_schema.index({ userId: 1, conversationId: 1 }, { unique: true });

const ChatRead =
  mongoose.models.chatreads || mongoose.model("chatreads", ChatRead_schema);

export { ChatRead, ChatRead_schema };
