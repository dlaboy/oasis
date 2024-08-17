var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Ingrediente = require('../models/ingredientes.js')
var db = require("../db.js");


// /* GET users listing. */
router.get('/', async function (req, res, next) {
    console.log("Cuerpo del ingrediente que llegó al backend", req.query)
    if (req.query.nombre != undefined){
        var ingredientes = await Ingrediente.find({nombre: req.query.nombre})

        console.log("Ingredientes buscados desde el backend",ingredientes)
    }
    else{
        var ingredientes = await Ingrediente.find({})

        console.log("Ninguna busqueda",ingredientes)

    }
    
    res.send(ingredientes);
});

module.exports = router;