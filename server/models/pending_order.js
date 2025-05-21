const mongoose = require("mongoose");

// const ItemSchema = new mongoose.Schema({
//     item_id:Number,
//     type: String,
//     ings: Array,
//     tops: Array,
//     qty: Number,
//     comments: String
// });


const PendingOrderSchema = new mongoose.Schema({
    Date: {
        type: Date,
        default: Date.now
    },
    paymentConfirmed: {
    type: Boolean,
    default: false
    },
    client_name : String,
    items: Object,
    payment_method: String,
    total: Number,
    status:  {
        type: String,
        default: 'in progress'
    },
})

const PendingOrder = mongoose.model('PendingOrder', PendingOrderSchema);

module.exports = PendingOrder;