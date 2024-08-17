const mongoose = require("mongoose");

const ToppingsSchema = new mongoose.Schema({
    nombre: String,
})

const Toppings = mongoose.model('Toppings', ToppingsSchema);

module.exports = Toppings;