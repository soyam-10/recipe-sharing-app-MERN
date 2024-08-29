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

router.post("/", authenticate('cook', 'admin'), createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeByID);
router.put("/:id", authenticate('cook', 'admin'), updateRecipeByID);
router.delete("/:id", authenticate('cook', 'admin'), deleteRecipeByID);
router.post("/:id/rating", authenticate('cook', 'admin'), addRating);
router.post("/:id/review", authenticate('cook', 'admin'), addReview);

module.exports = router;