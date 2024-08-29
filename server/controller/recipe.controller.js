const recipeModel = require("../models/recipe.model");

// POST request to add a new recipe
const createRecipe = async (req, res) => {
  try {
    const {
      title,
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
    const recipe = await recipeModel.findById(id);
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
    res
      .status(200)
      .json({
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
    res
      .status(200)
      .json({
        success: true,
        message: "Recipe deleted successfully",
        recipe: deletedRecipe,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred",
        error: err.message,
      });
  }
};

// GET request to filter recipes by category or tags
const filterRecipes = async (req, res) => {
  try {
    const { category, tags } = req.query;
    const tagsArray = tags ? tags.split(",") : [];
    const filterCriteria = {};
    if (category) filterCriteria.category = category;
    if (tagsArray.length > 0) filterCriteria.tags = { $in: tagsArray };
    const recipes = await recipeModel.find(filterCriteria);
    if (recipes.length === 0) {
      return res
        .status(200)
        .json({
          success: true,
          message: "No recipes found matching the criteria",
        });
    }
    res
      .status(200)
      .json({ success: true, recipes, totalRecipes: recipes.length });
  } catch (err) {
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
    // Add new rating
    recipe.ratings.push({ user, rating });
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
    // Add new review
    recipe.reviews.push({ user, review });
    await recipe.save();
    res
      .status(200)
      .json({ success: true, message: "Review added successfully", recipe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
};
