const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const {
  createRecipe,
  getRecipes,
  getRecipeByID,
  updateRecipeByID,
  deleteRecipeByID,
  addRating,
  addReview,
  getRecipesByUser,
  deleteRecipesByUser,
  searchRecipe, // Import the new function
} = require("../controller/recipe.controller");

router.post("/", authenticate("cook", "admin"), createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeByID);
router.put("/:id", authenticate("cook", "admin"), updateRecipeByID);
router.delete("/:id", authenticate("cook", "admin"), deleteRecipeByID);
router.put("/:id/rating", addRating);
router.put("/:id/review", addReview);
router.get("/user/:userId", getRecipesByUser);
router.get("/search/recipe", searchRecipe);
router.delete('/user/:userId', authenticate("admin"), deleteRecipesByUser);

module.exports = router;