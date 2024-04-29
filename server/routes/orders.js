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
// GET all totalATHs sales
// Use the aggregate function to calculate the sum
router.get('/salesATH',async function(req, res, next){
    Order.aggregate([
        {
            $match: {
                payment_method: "ATH"  // Filter to only include orders with payment method "ATH"
            }
        },
        {
            $group: {
                _id: null,  // Group all filtered documents into one group
                totalSalesATH: { $sum: "$total" }  // Sum the 'total' field
            }
        }
    ]).then(result => {
        if (result.length > 0) {
            if (result.length > 0) {
                res.send({ totalSalesATH: result[0].totalSalesATH });
            } else {
                res.status(404).send('No sales for ATH payment method found.');
            }
        } else {
            console.log('No sales for ATH payment method found.');
        }
    }).catch(err => {
        console.error('Error calculating total sales for ATH:', err);
    });


})

router.get('/salesCASH',async function(req, res, next){
    Order.aggregate([
        {
            $match: {
                payment_method: "CASH"  // Filter to only include orders with payment method "ATH"
            }
        },
        {
            $group: {
                _id: null,  // Group all filtered documents into one group
                totalSalesCASH: { $sum: "$total" }  // Sum the 'total' field
            }
        }
    ]).then(result => {
        if (result.length > 0) {
            if (result.length > 0) {
                res.send({ totalSalesCASH: result[0].totalSalesCASH });
            } else {
                res.status(404).send('No sales for CASH payment method found.');
            }
        } else {
            console.log('No sales for CASH payment method found.');
        }
    }).catch(err => {
        console.error('Error calculating total sales for CASH:', err);
    });
})
router.get('/count', async function(req,res, next){
    Order.aggregate([
        { $unwind: "$items" },  // Flatten the items array to process each item
        { $group: {
            _id: "$items.type",  // Group by item type
            totalQuantity: { $sum: "$items.qty" }  // Sum the quantity for each type
        }},
        { $sort: { _id: 1 } }  // Optional: sort by item type alphabetically
    ]).then(results => {
        res.send(results)
        console.log("Total Quantity by Item Type:", results);
    }).catch(err => {
        console.error("Error during aggregation:", err);
    });
    
})
router.post('/', async function (req, res) {
    const name = req.body.name;
    const items = req.body.items;
    const payment = req.body.payment_method;
    const total_to_pay = req.body.total

    console.log(items)

    let newOrder = new Order({client_name: name, items:items, payment_method: payment,total: total_to_pay})
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
