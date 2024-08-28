const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: String,
    bio: String,
});

module.exports = mongoose.model('User', userSchema);
