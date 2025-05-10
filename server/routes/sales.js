var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Sales = require('../models/sales.js')
var db = require("../db.js");
const moment = require('moment-timezone'); // Ensure this is installed

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND);

function formatEventDate(date) {
    return moment(date)
      .tz('America/Puerto_Rico')
      .format('YYYY-MM-DD hh:mm A'); // Formats date to 'YYYY-MM-DD' and time to 12-hour format with AM/PM
  }

router.get('/sum',async function (req, res, next) {
    try {
        const {month, day, year } = req.query;
        // const {year} = req.query;
        console.log("Year", year)

    
        // Build the date query dynamically based on provided params
        let query = {};
        if (month || day || year) {
            query.Date = {};
            if (year) {
                if (year && month == "" && day == ""){
                    const { startYearUtc, endYearUtc } = getLocalToUtcYearRange(year);
                    console.log(startYearUtc)
                    console.log(endYearUtc)
                    query.Date = {
                    $gte: startYearUtc,
                    $lt: endYearUtc
                    };
                }
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
        }, { Year:year,Month :month, IceCreams: 0, Drinks: 0, ATH: 0, Cash: 0, Total: 0 });

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
    console.log(error)
    res.status(500).send(error);
}
});

router.get('/avg_week_sales',async function (req,res,next) {
    try {
        const {month, day, year } = req.query;
        // const {year} = req.query;
        console.log("Year", year)

    
        // Build the date query dynamically based on provided params
        let query = {};
        if (month || day || year) {
            query.Date = {};
            if (year) {
                if (year && month == "" && day == ""){
                    const { startYearUtc, endYearUtc } = getLocalToUtcYearRange(year);
                    console.log(startYearUtc)
                    console.log(endYearUtc)
                    query.Date = {
                    $gte: startYearUtc,
                    $lt: endYearUtc
                    };
                }
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
        }
    
        const sales = await Sales.find(query);

        // console.log("Sale 1", sales[0].Date)


        // Calculate sums for each field, including day-of-week totals
        const totals = sales.reduce(
            (acc, sale) => {
            // console.log("sale.date",sale.date)
            const saleDate = new Date(sale.Date); // Convert sale.date to a Date object
            const dayOfWeek = saleDate.getDay(); // Get day of the week (0 for Sunday, 6 for Saturday)

            // console.log("Day of the week",typeof(dayOfWeek))
            // Initialize totals for days of the week if not already
            const days = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];
            acc.DayTotals = acc.DayTotals || {};
            acc[days[dayOfWeek]] = acc[days[dayOfWeek]]||{ total: 0, count: 0 };

            days.forEach(day => {
                acc.DayTotals[day] = acc.DayTotals[day] || 0;
            });

            acc[days[dayOfWeek]].total += sale.Total || 0;
            acc[days[dayOfWeek]].count += 1;
            acc[days[dayOfWeek]].avg = acc[days[dayOfWeek]].total/acc[days[dayOfWeek]].count;

            console.log(`Count for ${dayOfWeek}:${acc[days[dayOfWeek]].count}`);


            
            // else{
                // console.log("Paso tío")
            // }
            // console.log("Value",acc.DayTotals)

            // const d = typeof(days)
            console.log("Dia de la semana", dayOfWeek.toString())
        
            // Accumulate values
            acc.Year = year;
            acc.Month = month;
            acc.IceCreams += sale.IceCreams || 0;
            acc.Drinks += sale.Drinks || 0;
            acc.ATH += sale.ATH || 0;
            acc.Cash += sale.CASH || 0;
            acc.Total += sale.Total || 0;
            acc.DayTotals[days[dayOfWeek]] = acc[days[dayOfWeek]].avg || 0; // Accumulate Total for the specific day of the week
        
            return acc;
            },
            {
            Year: year,
            Month: month,
            IceCreams: 0,
            Drinks: 0,
            ATH: 0,
            Cash: 0,
            Total: 0,
            DayTotals: {},
            }
        );
        
        console.log("Totals",totals);
  

        // Send the response
        res.send({
            query: query,
            totals: totals,
            count: sales.length // Optional: include the number of sales records processed
        });

    } catch (error) {
        
    }

});

  
function getLocalToUtcMonthRange(year, month, timeZone = 'America/Puerto_Rico') {
  const moment = require('moment-timezone');

  const start = moment.tz({ year, month: month - 1, day: 1 }, timeZone).startOf('day');
  const end = start.clone().add(1, 'month');

  return {
    startUtc: new Date(start.toDate()),
    endUtc: new Date(end.toDate()),
  };
}
function getLocalToUtcYearRange(year, timeZone = 'America/Puerto_Rico') {
  const moment = require('moment-timezone');
  const start = moment.tz({ year, month: 0, day: 1 }, timeZone).startOf('day');
  const end = start.clone().add(12,'month');
  return {
    startYearUtc: new Date(start.toDate()),
    endYearUtc: new Date(end.toDate()),
  };
}

// /* GET users listing. */
router.get('/', async function (req, res, next) {
   // Build the date query dynamically based on provided params
   try {
    const {month, day,year } = req.query;
    // const year = "2024"

    console.log("Month",month)
    console.log("Year",year)
    console.log("Day",day)


    // Build the date query dynamically based on provided params
    let query = {};
    if (month || day || year) {
        query.Date = {};

        // if (year) {
            if (year && month == "" && day == ""){
                const { startYearUtc, endYearUtc } = getLocalToUtcYearRange(year);
                console.log(startYearUtc)
                console.log(endYearUtc)
                query.Date = {
                $gte: startYearUtc,
                $lt: endYearUtc
                };
            }
            if (month && day === "") {
                const { startUtc, endUtc } = getLocalToUtcMonthRange(year, month);
                console.log(startUtc)
                console.log(endUtc)
                query.Date = {
                $gte: startUtc,
                $lt: endUtc
                };

            }
            if (day) {
                console.log(typeof day)
                if (typeof day === 'string'){
                    let dia = Number(day)
                    let startDay = moment.tz({ year, month: month - 1, day: dia }, 'America/Puerto_Rico').startOf('day');
                    let endDay = startDay.clone().add(1,'day');
                    query.Date = {
                    $gte: startDay,
                    $lt: endDay
                    };
                }
            
              
            }
            // else{
            //     let startDay = new Date(year,month-1,day);
            //     console.log(`By Day: ${startDay}`)

            //     let endDay = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() + 1);
            //     query.Date.$gte = startDay;
            //     query.Date.$lt = endDay;
                
            // }
        // }
    }

    const sales = await Sales.find(query);

    // console.log("Sales Report",sales[0])

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

    formattedSales.reverse()

    // console.log("Formated Sales Report",formattedSales.reverse())
    console.log("Formated Sales Report",formattedSales.length)


    res.send(formattedSales);
} catch (error) {
    res.status(500).send(error);
}
   
   
});

const generateSaleEmailHTML = ({ ice_creams, drinks, ath, cash, total, report }) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="color: #333;">🧾 Resumen de Venta del Día</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Item</th>
            <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">🍦 Ice Creams</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${ice_creams}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">🥤 Drinks</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${drinks}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">💳 ATH</td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${ath.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">💵 Cash</td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${cash.toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold;">
            <td style="border: 1px solid #ccc; padding: 8px;">🧮 Total</td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      ${
        report
          ? `<p style="margin-top: 16px;">📎 <a href="${report}" target="_blank">View Report</a></p>`
          : `<p style="margin-top: 16px;">📎 No report attached</p>`
      }
    </div>
  `;
};


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

    // Send email
    // const { to, subject, html } = req.body;
    const to = 'jeylaboy22@icloud.com'
    const subject = "Venta de Hoy 🍨"
    const html = generateSaleEmailHTML({ice_creams,drinks,ath,cash,total,report})
    try {
        await resend.emails.send({
            from: 'info@dldevhouse.com',
            to,
            subject,
            html,
            });
        await resend.emails.send({
            from: 'info@dldevhouse.com',
            to:'laboydiego23@gmail.com',
            subject,
            html,
        });
        // res.status(200).json({ success: true, data });
        console.log("Email sent")

  } catch (error) {
    console.log("Error sending email",error)
    // res.status(500).json({ success: false, error: error.message });
  }
  
    res.status(200).json({ message: 'Sale Added', sale_id:id});
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
