import mongoose from "mongoose";

const BookReview_schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    bookId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

BookReview_schema.index({ userId: 1, bookId: 1 }, { unique: true });

const BookReview =
  mongoose.models.book_reviews ||
  mongoose.model("book_reviews", BookReview_schema);

export { BookReview, BookReview_schema };
