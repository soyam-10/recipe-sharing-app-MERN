const express = require("express");
const router = express.Router();
const {filterRecipes} = require("../controller/recipe.controller");

router.get("/", filterRecipes);

module.exports = router;