var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Favorites = require('../models/favorites.js')
var db = require("../db.js");


// /* GET users listing. */
router.get('/', async function (req, res, next) {
    console.log("Cuerpo del ingrediente que llegó al backend", req.query)
    if (req.query.nombre != undefined){
        var favorites = await Favorites.find({nombre: req.query.nombre})

        console.log("Favoritess buscados desde el backend",favorites)
    }
    else{
        var favorites = await Favorites.find({})

        console.log("Ninguna busqueda",favorites)

    }
    
    res.send(favorites);
});

module.exports = router;