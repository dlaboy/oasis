var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Order = require('../models/order.js')
var db = require("../db.js");


/* GET users listing. */
router.get('/', async function (req, res, next) {
    if (req.body.name){
        var orders = await Order.find({client_name: req.body.name})
    }
    else{
        var orders = await Order.find({})
    }
    
    res.send(orders);
});

router.post('/', async function (req, res) {
    const name = req.body.name;
    const items = req.body.items;
    const payment = req.body.payment_method;

    


    let newOrder = new Order({client_name: name, items:items, payment_method: payment})

    
    /**
     * This function below allows us to verify that both
     * the username and password for the user are correct. 
     * If they are, we indicate a successful login.
     */
    // var verifyUser = await loginVerify(username, password)

    // console.log(verifyUser)
    await newOrder.save();
    res.send("order sent").status(200)

})

module.exports = router;
