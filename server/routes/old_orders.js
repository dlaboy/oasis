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
        var orders = await OldOrder.find({client_name: req.body.name})
    }
    else{
        var orders = await OldOrder.find({})
    }
    
    res.send(orders);
});
// GET all totalATHs sales
// Use the aggregate function to calculate the sum
router.get('/salesATH',async function(req, res, next){
    OldOrder.aggregate([
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
    OldOrder.aggregate([
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
    OldOrder.aggregate([
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
    OldOrder.aggregate([
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
    OldOrder.aggregate([
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
router.post('/', async function (req, res) {
    const name = req.body.name;
    const items = req.body.items;
    const payment = req.body.payment_method;
    const total_to_pay = req.body.total

    console.log(items)

    let newOldOrder = new OldOrder({client_name: name, items:items, payment_method: payment,total: total_to_pay})
    /**
     * This function below allows us to verify that both
     * the username and password for the user are correct. 
     * If they are, we indicate a successful login.
     */
    // var verifyUser = await loginVerify(username, password)

    // console.log(verifyUser)
    await newOldOrder.save();
    res.send("order sent").status(200)

})

router.delete('/', async function (req, res){
    if(req.body.id != undefined){
        try{
            console.log(req.body.id)
            await OldOrder.findByIdAndDelete(req.body.id);
            res.status(200).json({ success: true, msg: 'OldOrder Deleted' });
        }
        catch(error){
            console.log('Error:', error)
        }
    }
    else{
        await OldOrder.deleteMany({})

    }

})

router.put('/', async function (req, res){
    try{
        console.log("ID of record to update: ",req.body.id)
        const updatedOldOrder = await OldOrder.findByIdAndUpdate(req.body.id, req.body.updated_record, { new: true })

        if (!updatedOldOrder) {
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

router.get('/avgICperHourPerDay', async function (req, res) {
  const orders = await OldOrder.find({});

  // Structure: { 'Monday': { '01 PM': { total: X, days: Set() }, ... } }
  const stats = {};

  orders.forEach(order => {
    if (order.Date) {
      const date = moment(order.Date).tz('America/Puerto_Rico');
      const hour = date.format('hh A');
      const dayName = date.format('dddd');
      const day = date.format('YYYY-MM-DD');

      if (!stats[dayName]) {
        stats[dayName] = {};
      }

      if (!stats[dayName][hour]) {
        stats[dayName][hour] = { total: 0, days: new Set() };
      }

      stats[dayName][hour].total += 1;
      stats[dayName][hour].days.add(day);
    }
  });

  // Format for frontend: [ { day: 'Monday', hour: '01 PM', avg: X }, ... ]
  const formattedData = [];
  for (const [day, hourMap] of Object.entries(stats)) {
    for (const [hour, data] of Object.entries(hourMap)) {
      if (hour !== '12 AM' && hour !== '11 PM') {
        formattedData.push({
          day,
          hour,
          avg: parseFloat((data.total / data.days.size).toFixed(2))
        });
      }
    }
  }
  console.log("Response bro",formattedData)

  res.send(formattedData);
});

module.exports = router;



module.exports = router;
