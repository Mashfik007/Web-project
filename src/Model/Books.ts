import mongoose from "mongoose";

const Book_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "author is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, "cover image is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
      totalRatings: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      totalReviews: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    price: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        required: true,
        default: "৳",
        trim: true,
      },
    },
    availability: {
      current: {
        type: Number,
        required: true,
        min: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    metadata: {
      publisher: {
        type: String,
        required: true,
        trim: true,
      },
      language: {
        type: String,
        required: true,
        trim: true,
      },
      series: {
        type: String,
        required: true,
        trim: true,
      },
      isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      published: {
        type: Number,
        required: true,
      },
      copiesHeld: {
        type: String,
        required: true,
        trim: true,
      },
      pages: {
        type: Number,
        required: true,
        min: 1,
      },
      genre: {
        type: String,
        required: true,
        trim: true,
      },
      deweyDecimal: {
        type: String,
        required: true,
        trim: true,
      },
    },
    community: {
      totalOnShelf: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      members: {
        type: [
          {
            id: { type: String, required: true },
            name: { type: String, required: true, trim: true },
            initials: { type: String, required: true, trim: true },
            color: { type: String, required: true, trim: true },
          },
        ],
        default: [],
      },
    },
    matchScore: {
      score: {
        type: Number,
        required: true,
        min: 0,
      },
      maxScore: {
        type: Number,
        required: true,
        default: 100,
      },
      label: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.models.books || mongoose.model("books", Book_schema);

export { Book, Book_schema };
