import mongoose from "mongoose";

const LibraryUser_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Member", "Librarian", "Admin"],
      default: "Member",
    },
    status: {
      type: String,
      enum: ["Active", "Suspended"],
      default: "Active",
    },
    borrows: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const LibraryUser =
  mongoose.models.libraryUsers ||
  mongoose.model("libraryUsers", LibraryUser_schema);

export { LibraryUser, LibraryUser_schema };
