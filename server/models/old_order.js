const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;


// const ItemSchema = new mongoose.Schema({
//     item_id:Number,
//     type: String,
//     ings: Array,
//     tops: Array,
//     qty: Number,
//     comments: String
// });


const OldOrderSchema = new mongoose.Schema({
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
    sale_id : ObjectId
})

const OldOrder = mongoose.model('OldOrder', OldOrderSchema);

module.exports = OldOrder;