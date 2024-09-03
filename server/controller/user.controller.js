const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const router = express.Router();

// Register User
const registerUser = async (req, res) => {
  const { fullName, email, password, profilePicture, bio, role } = req.body;

  // Restrict roles to only 'user' or 'cook'
  if (role && !["user", "cook"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePicture,
      bio,
      role: role || "user", // Default to 'user' if no role is provided
    });

    await user.save();
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        id: user.id,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required or Email is invalid",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET a user by ID
const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ success: true, users: allUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT request to update user by ID for profile section
const updateUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User updated",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT request to update password by ID
const updatePasswordByID = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password and update it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE request to delete a user by ID
const deleteUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addFavRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body; // The ID of the recipe to be added to favorites
    const { id } = req.params; // The ID of the user

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use the `find` method to check if the recipe is already in the user's favorites list
    const existingFav = user.favRecipes.find(
      (fav) => fav.recipeId || fav._id == recipeId
    );

    // If the recipe is already in favorites, return an appropriate response
    if (existingFav) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe is already in favorites" });
    } else {
      // If not, add the recipe to the favorites list
      user.favRecipes.push(recipeId);
      await user.save();

      res.status(200).json({
        success: true,
        existingFav: existingFav,
        message: "Recipe added to favorites",
        favRecipes: user.favRecipes,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFavRecipes = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("favRecipes").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return the favorite recipes
    res.status(200).json({
      success: true,
      total_recipes: user.favRecipes.length,
      recipes: user.favRecipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const removeFavRecipe = async (req, res) => {
  try {
    const { id } = req.params; // User ID
    const { recipeId } = req.body; // Recipe ID to be removed from favorites

    // Validate that recipeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ success: false, message: "Invalid recipe ID" });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the recipe is in the user's favorites
    const recipeIndex = user.favRecipes.findIndex(
      (fav) => fav._id.toString() === recipeId
    );

    if (recipeIndex === -1) {
      return res.status(404).json({ success: false, message: "Recipe not found in favorites" });
    }

    // Remove the recipe from favorites
    user.favRecipes.splice(recipeIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      fav_recipes_total: user.favRecipes.length,
      message: "Recipe removed from favorites",
      favRecipes: user.favRecipes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserByEmail,
  getAllUsers,
  getUserByID,
  updateUserByID,
  updatePasswordByID,
  deleteUserByID,
  addFavRecipe,
  getFavRecipes,
  removeFavRecipe,
};