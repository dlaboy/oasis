const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    item_id:Number,
    type: String,
    ings: Array,
    tops: Array,
    qty: Number,
    comments: String
});


const OrderSchema = new mongoose.Schema({
    client_name : String,
    items: [ItemSchema],
    payment_method: String,
    total: Number,
    status:  {
        type: String,
        default: 'in progress'
    },
})

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;