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
} = require("../controller/recipe.controller");

router.post("/", authenticate, createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeByID);
router.put("/:id", authenticate, updateRecipeByID);
router.delete("/:id", authenticate, deleteRecipeByID);
router.post("/:id/rating", authenticate, addRating);
router.post("/:id/review", authenticate, addReview);

module.exports = router;
