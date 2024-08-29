const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required"],
    },
    instructions: { type: String },
    tags: { type: [String] },
    category: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: { type: Date, default: Date.now },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: String,
      },
    ],
  },
  { timestamps: true }
);

// Index for faster search by title
recipeSchema.index({ title: 1 });

module.exports = mongoose.model("Recipe", recipeSchema);
