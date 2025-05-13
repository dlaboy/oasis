const { Timestamp } = require("mongodb");
const moment = require('moment-timezone');
let localDate = moment.tz(Date.now, "America/Puerto_Rico");
let utcDate = localDate.utc();

const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  Date: {
    type: Date,
    default: Date.now,
    required: true
  },
  // Set this to true if it's a closure (no sales)
  Closed: {
    type: Boolean,
    default: false
  },
  // Optional closure note/message
  Message: {
    type: String,
    required: function () {
      return this.Closed === true;
    }
  },
  Name: String, // person who closed

  // Sales data — only present if not closed
  IceCreams: Number,
  Drinks: Number,
  ATH: Number,
  CASH: Number,
  Total: Number,

  Report: {
    type: String,
    required: false // e.g. URL to PDF report
  }
});

const Sales = mongoose.model("Sales", SalesSchema);
module.exports = Sales;
