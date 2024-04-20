const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    client_name : String,
    items: Array,
    payment_method: String
})

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;