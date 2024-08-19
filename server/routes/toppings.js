var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Toppings = require('../models/toppings.js');
var db = require("../db.js");

// /* GET users listing. */
router.get('/', async function (req, res, next) {
    console.log("Cuerpo del ingrediente que llegó al backend", req.query);
    
    let toppings;
    if (req.query.nombre != undefined) {
        // Use a regular expression to find all toppings that start with the given string
        const searchPattern = new RegExp('^' + req.query.nombre, 'i');
        toppings = await Toppings.find({ nombre: { $regex: searchPattern } });
        
        console.log("Toppings buscados desde el backend", toppings);
    } else {
        toppings = await Toppings.find({});
        
        console.log("Ninguna busqueda", toppings);
    }
    
    res.send(toppings);
});

module.exports = router;
