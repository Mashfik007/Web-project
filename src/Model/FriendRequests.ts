import mongoose from "mongoose";

const FriendRequest_schema = new mongoose.Schema(
  {
    fromId: {
      type: String,
      required: [true, "sender is required"],
      trim: true,
    },
    toId: {
      type: String,
      required: [true, "recipient is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true },
);

FriendRequest_schema.index({ fromId: 1, toId: 1 }, { unique: true });

const FriendRequest =
  mongoose.models.friendRequests ||
  mongoose.model("friendRequests", FriendRequest_schema);

export { FriendRequest, FriendRequest_schema };
