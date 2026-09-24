import mongoose from "mongoose";

const ArchivedAuthor_schema = new mongoose.Schema(
  {
    originalId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    author: {
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

const ArchivedAuthor =
  mongoose.models.archivedAuthors ||
  mongoose.model("archivedAuthors", ArchivedAuthor_schema);

export { ArchivedAuthor, ArchivedAuthor_schema };
