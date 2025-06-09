var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var ErrorPercentage = require('../models/errorpercentage.js');
var db = require("../db.js");

// GET porcentaje de error por cada entrada
router.get('/', async function (req, res, next) {
  try {
    const data = await ErrorPercentage.find({});

    const result = data.map(item => {
      const trueValue = item.verdadero;
      const predictedValue = item.predecido;

      if (trueValue === 0) {
        return {
          id: item._id,
          error_percentage: null,
          message: "Valor verdadero es 0, no se puede calcular el porcentaje de error.",
        };
      }

      const error = Math.abs((trueValue - predictedValue) / trueValue) * 100;

      return {
        id: item._id,
        true_value: trueValue,
        predicted_value: predictedValue,
        error_percentage: error.toFixed(2) + '%',
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error al calcular el porcentaje de error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// POST para guardar una nueva entrada
router.post('/', async function (req, res) {
  try {
    const { verdadero, predecido } = req.body;

    // Validación básica
    if (verdadero === undefined || predecido === undefined) {
      return res.status(400).json({ message: "Faltan los campos 'verdadero' y/o 'predecido'" });
    }

    const trueValue = parseFloat(verdadero);
    const predictedValue = parseFloat(predecido);

    if (isNaN(trueValue) || isNaN(predictedValue)) {
      return res.status(400).json({ message: "Los valores deben ser numéricos" });
    }

    // Guardar en MongoDB
    const newEntry = new ErrorPercentage({
      verdadero: trueValue,
      predecido: predictedValue
    });

    await newEntry.save();

    res.status(201).json({ message: "Entrada guardada exitosamente", data: newEntry });
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

router.get('/global', async function (req, res) {
  try {
    const entries = await ErrorPercentage.find({});

    if (entries.length === 0) {
      return res.status(404).json({ message: "No hay datos para calcular el porcentaje de error global." });
    }

    let totalError = 0;
    let validCount = 0;

    entries.forEach(item => {
      const verdadero = parseFloat(item.verdadero);
      const predecido = parseFloat(item.predecido);

      if (!isNaN(verdadero) && verdadero !== 0 && !isNaN(predecido)) {
        const error = Math.abs((verdadero - predecido) / verdadero) * 100;
        totalError += error;
        validCount++;
      }
    });

    if (validCount === 0) {
      return res.status(400).json({ message: "No hay valores válidos para calcular el porcentaje de error." });
    }

    const globalError = totalError / validCount;

    res.json({
      muestras: validCount,
      porcentaje_error_global: globalError.toFixed(2) + "%"
    });

  } catch (error) {
    console.error("❌ Error al calcular el porcentaje de error global:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


module.exports = router;
