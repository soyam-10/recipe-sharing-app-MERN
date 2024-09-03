const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  bio: { type: String },
  role: { type: String, enum: ["user", "cook", "admin"], default: "user" },
  joinedAt: { type: Date, default: Date.now },
  favRecipes: [
    {
      recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
      }
    }
  ]
},{ timestamps: true });

module.exports = mongoose.model("User", userSchema);
