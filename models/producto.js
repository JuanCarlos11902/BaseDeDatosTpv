const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    price:{
        type:Number,
        required:true
    },
    availability:{
        type:Boolean,
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['Bebida','Comida'],
    },
    image:{
        type:Buffer,
        required:true
    }

})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;