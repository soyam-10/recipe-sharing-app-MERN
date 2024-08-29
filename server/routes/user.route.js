const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getAllUsers, getUserByEmail } = require('../controller/user.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/allUser', getAllUsers);
router.get('/userByEmail', getUserByEmail);

module.exports = router;
