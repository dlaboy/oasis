var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Ingrediente = require('../models/ingredientes.js');
var db = require("../db.js");

// /* GET users listing. */
router.get('/', async function (req, res, next) {
    console.log("Cuerpo del ingrediente que llegó al backend", req.query);
    
    let ingredientes;
    if (req.query.nombre != undefined) {
        // Use a regular expression to find all ingredients that start with the given string
        const searchPattern = new RegExp('^' + req.query.nombre, 'i');
        ingredientes = await Ingrediente.find({ nombre: { $regex: searchPattern } });
        
        console.log("Ingredientes buscados desde el backend", ingredientes);
    } else {
        ingredientes = await Ingrediente.find({});
        
        console.log("Ninguna busqueda", ingredientes);
    }
    
    res.send(ingredientes);
});

module.exports = router;
