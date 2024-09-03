const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByEmail,
  getUserByID,
  updateUserByID,
  updatePasswordByID,
  deleteUserByID,
  addFavRecipe,
  getFavRecipes,
  removeFavRecipe,
} = require("../controller/user.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/allUser", getAllUsers);
router.get("/email", getUserByEmail);
router.get("/:id", getUserByID);
router.put("/:id", updateUserByID);
router.delete("/:id", authenticate("admin"), deleteUserByID);
router.put("/password/:id", updatePasswordByID);
router.post("/addToFav/:id", addFavRecipe);
router.delete("/removeFromFav/:id", removeFavRecipe); // Add the new route
router.get("/favRecipes/:id", getFavRecipes);

module.exports = router;
