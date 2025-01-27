require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: ['https://hamro-recipe.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true, // Enable Access-Control-Allow-Credentials
  optionsSuccessStatus: 204 // Some legacy browsers choke on 204
}));

// MongoDB connection setup
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

// Import route handlers
const recipeRoutes = require("./routes/recipe.route");
const userRoutes = require("./routes/user.route");

// Use routes
app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Recipe Sharing App API");
});

// Start the server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
