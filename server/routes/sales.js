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

router.get('/sum',async function (req, res, next) {
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

        // Complete the code here

          // Calculate sums for each field
         const totals = sales.reduce((acc, sale) => {
            acc.Month = month
            acc.IceCreams += sale.IceCreams || 0;
            acc.Drinks += sale.Drinks || 0;
            acc.ATH += sale.ATH || 0;
            acc.Cash += sale.CASH || 0;
            acc.Total += sale.Total || 0;
            return acc;
        }, { Month :month, IceCreams: 0, Drinks: 0, ATH: 0, Cash: 0, Total: 0 });

        console.log("TOTALS: ",totals)

        // Send the response
        res.send({
            query: query,
            totals: totals,
            count: sales.length // Optional: include the number of sales records processed
        });

    
        // const formattedSales = sales.map(sale => ({
        //     ...sale,
        //     _id:sale._id,
        //     Date: moment(sale.Date).tz('America/Puerto_Rico').format('YYYY-MM-DD hh:mm A'),
        //     IceCreams:sale.IceCreams,
        //     Drinks:sale.Drinks,
        //     ATH:sale.ATH,
        //     CASH:sale.CASH,
        //     Total:sale.Total,
        //     Report:sale.Report
        // }));
        // res.send(formattedSales);
} catch (error) {
    res.status(500).send(error);
}
});

  

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
        IceCreams:sale.IceCreams,
        Drinks:sale.Drinks,
        ATH:sale.ATH,
        CASH:sale.CASH,
        Total:sale.Total,
        Report:sale.Report
    }));

    res.send(formattedSales);
} catch (error) {
    res.status(500).send(error);
}
   
   
});

router.post('/', async function (req, res) {
    const ice_creams = req.body.ice_creams
    const drinks = req.body.drinks
    const ath = req.body.ath
    const cash = req.body.cash;
    const total = req.body.total;
    const report = req.body.report;

    let newSale = new Sales({IceCreams:ice_creams,Drinks:drinks, ATH:ath, CASH:cash,Total:total, Report:report})

    console.log(newSale)
    let id = newSale._id
    /**
     * This function below allows us to verify that both
     * the username and password for the user are correct. 
     * If they are, we indicate a successful login.
     */
    // var verifyUser = await loginVerify(username, password)

    // console.log(verifyUser)
    await newSale.save();
    res.status(200).json({ message: 'Sale Added', sale_id:id });
    // res.send("Sale Added").status(200)

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
