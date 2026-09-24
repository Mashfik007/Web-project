import mongoose from "mongoose";

const ArchivedLibraryUser_schema = new mongoose.Schema(
  {
    originalId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    archivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const ArchivedLibraryUser =
  mongoose.models.archivedLibraryUsers ||
  mongoose.model("archivedLibraryUsers", ArchivedLibraryUser_schema);

export { ArchivedLibraryUser, ArchivedLibraryUser_schema };
