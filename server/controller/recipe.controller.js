const recipeModel = require("../models/recipe.model");

// POST request to add a new recipe
const createRecipe = async (req, res) => {
  try {
    const {
      title,
      recipePicture,
      cookTime,
      description,
      ingredients,
      instructions,
      tags,
      category,
      user,
      ratings,
      reviews,
    } = req.body;
    const newRecipe = await recipeModel.create({
      title,
      recipePicture,
      cookTime,
      description,
      ingredients,
      instructions,
      tags,
      category,
      user,
      ratings: ratings || [],
      reviews: reviews || [],
    });
    res
      .status(201)
      .json({ success: true, message: "New Recipe added", newRecipe });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
};

// GET request to fetch all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel.find();
    res
      .status(200)
      .json({ success: true, totalRecipes: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET a single recipe by ID
const getRecipeByID = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await recipeModel
      .findById(id)
      .populate("user", "fullName profilePicture") // populate the user who created the recipe
      .populate("reviews.user", "fullName profilePicture") // populate the users in the reviews
      .populate("ratings.user", "fullName profilePicture"); // populate the users in the ratings;
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ success: true, recipe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT request to update a recipe by ID
const updateRecipeByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecipe = await recipeModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRecipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }
    res.status(200).json({
      success: true,
      message: "Recipe updated",
      recipe: updatedRecipe,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE request to delete a recipe by ID
const deleteRecipeByID = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await recipeModel.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }
    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
      recipe: deletedRecipe,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: err.message,
    });
  }
};

const filterRecipes = async (req, res) => {
  try {
    console.log("Filter recipes route hit"); // Log to check if this route is hit

    const { category, limit } = req.query;
    const filterCriteria = {};
    if (category) {
      filterCriteria.category = { $regex: `^${category}$`, $options: "i" };
    }

    let recipes = await recipeModel.find(filterCriteria);

    if (limit) {
      recipes = recipes.slice(0, Number(limit));
    }

    if (recipes.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No recipes found matching the criteria",
      });
    }

    res
      .status(200)
      .json({ success: true, recipes, totalRecipes: recipes.length });
  } catch (err) {
    console.error("Error fetching recipes:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST request to add a rating to a recipe
const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, rating } = req.body;
    const recipe = await recipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    // Check if the user has already rated this recipe
    const existingRating = recipe.ratings.find(
      (r) => r.user.toString() === user
    );
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
    } else {
      // Add new rating
      recipe.ratings.push({ user, rating });
    }
    await recipe.save();
    res
      .status(200)
      .json({ success: true, message: "Rating added successfully", recipe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST request to add a review to a recipe
const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, review } = req.body;
    const recipe = await recipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    // Check if the user has already reviewed this recipe
    const existingReview = recipe.reviews.find(
      (r) => r.user.toString() === user
    );
    if (existingReview) {
      // Update existing review
      existingReview.review = review;
    } else {
      // Add new review
      recipe.reviews.push({ user, review });
    }
    await recipe.save();
    res
      .status(200)
      .json({ success: true, message: "Review added successfully", recipe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET request to fetch recipes by user ID
const getRecipesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const recipes = await recipeModel.find({ user: userId });
    if (recipes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No recipes found for this user",
        recipes: [],
      });
    }
    res
      .status(200)
      .json({ success: true, totalRecipes: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE request to delete all recipes uploaded by a specific user
const deleteRecipesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find and delete all recipes by the user
    const result = await recipeModel.deleteMany({ user: userId });
    if (result.deletedCount === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No recipes found for this user" });
    }
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} recipe(s) deleted`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const searchRecipe = async (req, res) => {
  try {
    const { query } = req.query;

    // Check if query parameter is provided
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required and must be a string",
      });
    }
    // Perform the search
    const recipes = await recipeModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search for title
        { description: { $regex: query, $options: "i" } }, // Case-insensitive search for description
        { category: { $regex: query, $options: "i" } }, // Case-insensitive search for category
        { tags: { $regex: query, $options: "i" } }, // Case-insensitive search for category
        { ingredients: { $regex: query, $options: "i" } }, // Case-insensitive search for ingredients
      ],
    });

    if (recipes.length == 0) {
      res.status(404).json({
        success: false,
        total_found_recipes: recipes.length,
        recipes,
        message: "No recipes found Try searching other term.  "
      });
    } else {
      // Respond with the results
      res.status(200).json({
        success: true,
        total_found_recipes: recipes.length,
        recipes,
      });
    }
  } catch (error) {
    // Log the error for debugging
    console.error("Error searching recipes:", error);
    res.status(500).json({
      success: false,
      message: "Error searching recipes",
      error: error.message,
    });
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeByID,
  updateRecipeByID,
  deleteRecipeByID,
  filterRecipes,
  addRating,
  addReview,
  getRecipesByUser,
  deleteRecipesByUser,
  searchRecipe,
};
