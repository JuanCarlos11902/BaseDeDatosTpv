const mongoose = require("mongoose");

const checkSchema = mongoose.Schema({

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    totalPrice: {
        type: Number
    },
    date:{
        type:Date,
        default:Date.now
    },
    checkStatus:{
        type:String,
        enum:['pending', 'closed', 'notCreated'],
        default: "pending"
    }
})

const Check = mongoose.model("Check", checkSchema);

module.exports = Check;