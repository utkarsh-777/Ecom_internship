const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const OrderSchema = new mongoose.Schema({
    items:[
        {
            type:ObjectId,
            ref:"Product"
        }
    ]
},{timestamps:true});

module.exports = mongoose.model('Product',ProductSchema);