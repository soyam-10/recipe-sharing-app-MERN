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
} = require("../controller/user.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/allUser", getAllUsers);
router.get("/email", getUserByEmail);
router.get("/:id", getUserByID);
router.put("/:id", updateUserByID);
router.delete("/:id", authenticate("admin"), deleteUserByID);
router.put("/password/:id", updatePasswordByID);

module.exports = router;
