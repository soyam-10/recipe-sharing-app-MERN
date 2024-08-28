const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: [String],
    instructions: String,
    tags: [String],
    category: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }],
    reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, review: String }],
});

module.exports = mongoose.model('Recipe', recipeSchema);
