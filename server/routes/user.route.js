const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByEmail,
  getUserByID,
} = require("../controller/user.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/allUser", getAllUsers);
router.get("/email", getUserByEmail);
router.get("/:id", getUserByID);

module.exports = router;
