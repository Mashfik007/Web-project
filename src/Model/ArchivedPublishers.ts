import mongoose from "mongoose";

const ArchivedPublisher_schema = new mongoose.Schema(
  {
    originalId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    publisher: {
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

const ArchivedPublisher =
  mongoose.models.archivedPublishers ||
  mongoose.model("archivedPublishers", ArchivedPublisher_schema);

export { ArchivedPublisher, ArchivedPublisher_schema };
