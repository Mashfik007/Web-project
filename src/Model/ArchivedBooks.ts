import mongoose from "mongoose";

const ArchivedBook_schema = new mongoose.Schema(
  {
    originalId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    book: {
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

const ArchivedBook =
  mongoose.models.archivedBooks ||
  mongoose.model("archivedBooks", ArchivedBook_schema);

export { ArchivedBook, ArchivedBook_schema };
