var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Order = require('../models/order.js')
var OldOrder = require('../models/old_order.js')
var db = require("../db.js");
const moment = require('moment-timezone'); // Ensure this is installed



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
// GET all totalATHs orders
// Use the aggregate function to calculate the sum
router.get('/ordersATH',async function(req, res, next){
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
                res.status(404).send('No orders for ATH payment method found.');
            }
        } else {
            console.log('No orders for ATH payment method found.');
        }
    }).catch(err => {
        console.error('Error calculating total orders for ATH:', err);
    });


})

router.get('/ordersCASH',async function(req, res, next){
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
                res.status(404).send('No orders for CASH payment method found.');
            }
        } else {
            console.log('No orders for CASH payment method found.');
        }
    }).catch(err => {
        console.error('Error calculating total orders for CASH:', err);
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
        // console.log("Total Quantity by Item Type:", results);
    }).catch(err => {
        console.error("Error during aggregation:", err);
    });
    
})
router.get('/countIngredients',async function(req,res, next){
    Order.aggregate([
        { $unwind: "$items" },  // Unwind the items array
        { $unwind: "$items.ings" },  // Unwind the ingredients array within each item
        { $group: {
            _id: "$items.ings",  // Group by ingredient
            totalQuantity: { $sum: "$items.qty" }  // Sum the quantities
        }},
        { $sort: { totalQuantity: -1 } },  // Sort by totalQuantity in descending order
        { $limit: 5 }  // Limit to top 5 results
    ]).then(results => {
        // console.log("Total Quantity by Ingredient:", results);
        res.send(results)
        // If you need to save these into variables:
       
    }).catch(err => {
        console.error("Error during aggregation:", err);
    });
    
})
router.get('/countToppings',async function(req,res, next){
    Order.aggregate([
        { $unwind: "$items" },  // Unwind the items array
        { $unwind: "$items.tops" },  // Unwind the ingredients array within each item
        { $group: {
            _id: "$items.tops",  // Group by ingredient
            totalQuantity: { $sum: "$items.qty" }  // Sum the quantities
        }},
        { $sort: { totalQuantity: -1 } },  // Sort by totalQuantity in descending order
        { $limit: 5 }  // Limit to top 5 results
    ]).then(results => {
        // console.log("Total Quantity by Toppings:", results);
        res.send(results)
        // If you need to save these into variables:
       
    }).catch(err => {
        console.error("Error during aggregation:", err);
    });
    
})
router.get('/getCrunchTime', async function (req, res, next) {
    // if (req.body.name){
    //     var orders = await Order.find({client_name: req.body.name})
    // }
    // else{
    // }
    var orders = await Order.find({});

    // Group by hour
    let hourlyCounts = {};

    orders.forEach(order => {
        let hour = moment(order.Date).tz('America/Puerto_Rico').format('hh A'); // "01 PM", "02 PM"
        
        if (hourlyCounts[hour]) {
            hourlyCounts[hour]++;
        } else {
            hourlyCounts[hour] = 1;
        }
    });

    // Convert to array for chart
    let formattedData = Object.keys(hourlyCounts).map(hour => ({
        hour,
        count: hourlyCounts[hour]
    }));

    // Sort by time order (AM/PM)
    formattedData.sort((a, b) => moment(a.hour, 'hh A') - moment(b.hour, 'hh A'));

    res.send(formattedData);
});
router.post('/', async function (req, res) {
    const name = req.body.name;
    const items = req.body.items;
    const payment = req.body.payment_method;
    const total_to_pay = req.body.total

    console.log(items)

    let newOrder = new Order({client_name: name, items:items, payment_method: payment,total: total_to_pay, })
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
        console.log("ID of record to update: ",req.body.id)
        const updatedOrder = await Order.findByIdAndUpdate(req.body.id, req.body.updated_record, { new: true })

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Item not found' });
          }
        else{
            return res.status(200).json({ message: 'Item found' });

        }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})

const { ObjectId } = mongoose.Types;


// POST route to copy data from 'orders' to 'old_orders'
router.post('/copy_orders', async (req, res) => {
    try {

        const sale_id = req.body.sale_id
        console.log("COPYING",req.body.sale_id)

        // Fetch all orders
        const orders = await Order.find();

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found to copy" });
        }

        // const orderIdObject = new ObjectId(order_id);
        // Attach order_id to each order
        const ordersWithSaleId = orders.map(order => ({
            ...order.toObject(),
            sale_id
        }));

        console.log("Orders with Sale ID", ordersWithSaleId)

        // Insert them into 'old_orders'
        const result = await OldOrder.insertMany(ordersWithSaleId);

        console.log("Successfully copied orders")
        res.status(200).json({ message: 'Orders copied successfully', result });
    } catch (error) {
        console.error('Error copying orders:', error);
        res.status(500).json({ message: 'Error copying orders', error });
    }
});


module.exports = router;
