const mongoose = require("mongoose");

const FavoritesSchema = new mongoose.Schema({
    nombre: String,
})

const Favorites = mongoose.model('Favorites', FavoritesSchema);

module.exports = Favorites;