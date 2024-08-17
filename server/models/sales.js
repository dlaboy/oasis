const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const moment = require('moment-timezone');
let localDate = moment.tz(Date.now, "America/Puerto_Rico");
let utcDate = localDate.utc();

const SalesSchema = new mongoose.Schema({
    Date: {
        type: Date,
        default: Date.now
    },
    IceCreams:Number,
    Drinks:Number,
    ATH:Number,
    CASH:Number,
    Total:Number
})

const Sales = mongoose.model('Sales', SalesSchema);

module.exports = Sales;