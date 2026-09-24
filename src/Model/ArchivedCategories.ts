import mongoose from "mongoose";

const ArchivedCategory_schema = new mongoose.Schema(
  {
    originalId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    category: {
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

const ArchivedCategory =
  mongoose.models.archivedCategories ||
  mongoose.model("archivedCategories", ArchivedCategory_schema);

export { ArchivedCategory, ArchivedCategory_schema };
