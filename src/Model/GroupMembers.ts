import mongoose from "mongoose";

const GroupMember_schema = new mongoose.Schema(
  {
    groupId: {
      type: String,
      required: [true, "group is required"],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "user is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

GroupMember_schema.index({ groupId: 1, userId: 1 }, { unique: true });

const GroupMember =
  mongoose.models.groupmembers || mongoose.model("groupmembers", GroupMember_schema);

export { GroupMember, GroupMember_schema };
