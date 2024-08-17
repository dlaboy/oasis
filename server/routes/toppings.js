var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Toppings = require('../models/toppings.js')
var db = require("../db.js");


// /* GET users listing. */
router.get('/', async function (req, res, next) {
    console.log("Cuerpo del ingrediente que llegó al backend", req.query)
    if (req.query.nombre != undefined){
        var toppings = await Toppings.find({nombre: req.query.nombre})

        console.log("Toppingss buscados desde el backend",toppings)
    }
    else{
        var toppings = await Toppings.find({})

        console.log("Ninguna busqueda",toppings)

    }
    
    res.send(toppings);
});

module.exports = router;