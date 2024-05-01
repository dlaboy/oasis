var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Sales = require('../models/sales.js')
var db = require("../db.js");
const moment = require('moment-timezone'); // Ensure this is installed


function formatEventDate(date) {
    return moment(date)
      .tz('America/Puerto_Rico')
      .format('YYYY-MM-DD hh:mm A'); // Formats date to 'YYYY-MM-DD' and time to 12-hour format with AM/PM
  }

  

// /* GET users listing. */
router.get('/', async function (req, res, next) {
   // Build the date query dynamically based on provided params
   try {
    const {month, day } = req.query;
    const year = "2024"

    // Build the date query dynamically based on provided params
    let query = {};
    if (month || day) {
        query.Date = {};

        if (month) {
            console.log("Month", month)
            let startMonth = new Date(year,month-1,1);
            console.log(`By Start Month: ${formatEventDate(startMonth)}`)
            let endMonth = new Date(startMonth.getFullYear(), startMonth.getMonth() + 1,1);
            console.log(`By End Month: ${formatEventDate(endMonth)}`)
            
            query.Date.$gte = startMonth;
            query.Date.$lt = endMonth;
        }
        if (day) {
            let startDay = new Date(year,month-1,day);
            console.log(`By Day: ${startDay}`)
            
            let endDay = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() + 1);
            query.Date.$gte = startDay;
            query.Date.$lt = endDay;
        }
    }

    const sales = await Sales.find(query);

    const formattedSales = sales.map(sale => ({
        ...sale,
        _id:sale._id,
        Date: moment(sale.Date).tz('America/Puerto_Rico').format('YYYY-MM-DD hh:mm A'),
        Items:sale.Items,
        ATH:sale.ATH,
        CASH:sale.CASH,
        Total:sale.Total
    }));

    res.send(formattedSales);
} catch (error) {
    res.status(500).send(error);
}
   
   
});

router.post('/', async function (req, res) {
    const items = req.body.items
    const ath = req.body.ath
    const cash = req.body.cash;
    const total = req.body.total;

    let newSale = new Sales({Items:items, ATH:ath, CASH:cash,Total:total})

    console.log(newSale)
    /**
     * This function below allows us to verify that both
     * the username and password for the user are correct. 
     * If they are, we indicate a successful login.
     */
    // var verifyUser = await loginVerify(username, password)

    // console.log(verifyUser)
    await newSale.save();
    res.send("Sale Added").status(200)

})

router.delete('/', async function (req, res){
    if(req.body.id != undefined){
        try{
            console.log(typeof(req.body.id))
            await Sales.findByIdAndDelete(req.body.id);
            res.status(200).json({ success: true, msg: 'Sales Deleted' });
        }
        catch(error){
            console.log('Error:', error)
        }
    }
    else{
        await Sales.deleteMany({})

    }

})

router.put('/', async function (req, res){
    try{
        console.log(req.body.id)
        const updatedSale= await Sales.findByIdAndUpdate(req.body.id, req.body.data, { new: true })

        if (!updatedSale) {
            return res.status(404).json({ message: 'Field not found' });
          }
    } catch (error) {
        console.error('Error updating field:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})

module.exports = router;
