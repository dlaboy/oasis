const mongoose = require('mongoose');

const ErrorPercentageSchema = new mongoose.Schema({
  verdadero: {
    type: Number, // esto acepta enteros y decimales
    required: true
  },
  predecido: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('ErrorPercentage', ErrorPercentageSchema);
