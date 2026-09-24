import mongoose from "mongoose";

const Follow_schema = new mongoose.Schema(
  {
    followerId: {
      type: String,
      required: [true, "follower is required"],
      trim: true,
    },
    followingId: {
      type: String,
      required: [true, "following user is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

Follow_schema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow =
  mongoose.models.follows || mongoose.model("follows", Follow_schema);

export { Follow, Follow_schema };
