const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const router = express.Router();

// Register User
const registerUser = async (req, res) => {
  const { email, password, profilePicture, bio, role } = req.body;

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
      email,
      password: hashedPassword,
      profilePicture,
      bio,
      role: role || "user", // Default to 'user' if no role is provided
    });

    await user.save();
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      token,
      user: {
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
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the token and user details
    res.status(200).json({
      token,
      user: {
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        id: user.id,
      },
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query; // Fetch email from query parameters

  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return user details excluding the password
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    // Exclude sensitive information like passwords
    const sanitizedUsers = users.map((user) => ({
      id: user._id,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
    }));

    res.status(200).json({ success: true, users: sanitizedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { registerUser, loginUser, getUserByEmail, getAllUsers };
