const mongoose = require("mongoose");

const IngredienteSchema = new mongoose.Schema({
    nombre: String,
})

const Ingrediente = mongoose.model('Ingrediente', IngredienteSchema);

module.exports = Ingrediente;