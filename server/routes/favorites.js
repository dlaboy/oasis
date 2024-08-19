var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Favorites = require('../models/favorites.js');
var db = require("../db.js");

// /* GET users listing. */
router.get('/', async function (req, res, next) {
    console.log("Cuerpo del ingrediente que llegó al backend", req.query);
    
    let favorites;
    if (req.query.nombre != undefined) {
        // Use a regular expression to find all favorites that start with the given string
        const searchPattern = new RegExp('^' + req.query.nombre, 'i');
        favorites = await Favorites.find({ nombre: { $regex: searchPattern } });
        
        console.log("Favorites buscados desde el backend", favorites);
    } else {
        favorites = await Favorites.find({});
        
        console.log("Ninguna busqueda", favorites);
    }
    
    res.send(favorites);
});

module.exports = router;
