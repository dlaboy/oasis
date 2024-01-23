var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Order = require('../routes/orders.js')
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

router.delete('/', async function (req, res){
    if(req.body.id != undefined){
        try{
            console.log(req.body.id)
            await Order.findByIdAndDelete(req.body.id);
            res.status(200).json({ success: true, msg: 'Order Deleted' });
        }
        catch(error){
            console.log('Error:', error)
        }
    }
    else{
        await Order.deleteMany({})

    }

})

router.put('/', async function (req, res){
    try{
        console.log(req.body.id)
        const updatedOrder = await Order.findByIdAndUpdate(req.body.id, req.body.data, { new: true })

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Item not found' });
          }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})

module.exports = router;
