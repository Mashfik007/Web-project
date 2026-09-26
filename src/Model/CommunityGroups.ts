import mongoose from "mongoose";

const CommunityGroup_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      unique: true,
      maxlength: 80,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
      maxlength: 280,
    },
    createdBy: {
      type: String,
      required: [true, "creator is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

const CommunityGroup =
  mongoose.models.communitygroups ||
  mongoose.model("communitygroups", CommunityGroup_schema);

export { CommunityGroup, CommunityGroup_schema };
