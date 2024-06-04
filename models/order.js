const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    tableNumber: {
        type: Number,
        required:true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    totalPrice: {
        type: Number
    },
    orderStatus:{
        type:String,
        enum:['pending', 'completed'],
        default: "pending"
    },
    orderDescription: {
        type: String,
        default: "No hay ninguna descripción para este pedido"
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

orderSchema.methods.calculateTotalPrice = function(){
    try {
        let totalPrice = 0;
        this.populate('products').then(products =>{
            if (this.products && this.products.length > 0) {
                this.products.forEach(product => {
                    totalPrice += product.price;
                });
            }
        }).catch(error=>{console.log(error)})

        return totalPrice;

    } catch(error) {
        throw new Error("Error al calcular el precio total del pedido");
    }
};


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;