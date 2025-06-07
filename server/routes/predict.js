const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.get("/", (req, res) => {
  exec("python ml-model/predictor.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar Python: ${error.message}`);
      return res.status(500).json({ error: "Error al predecir" });
    }
    console.log(`stdout: ${stdout}`);

    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (parseError) {
      console.error("Error al parsear salida de Python:", parseError);
      res.status(500).json({ error: "Error al leer predicción" });
    }
  });
});

module.exports = router;
