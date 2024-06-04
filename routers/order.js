const express = require("express");
const Order = require("../models/order");
const router = new express.Router();
const io = require('../socket/socket');

router.post("/order/add", async(req,res) =>{
    const order = new Order({
        tableNumber: req.body.tableNumber,
        products: req.body.products,
        totalPrice: req.body.totalPrice,
        orderDescription: req.body.orderDescription,
        orderStatus:'pending'
    });
    try{
        await order.save();
        await order.populate('products');
        console.log(order);
        io.getIO().emit('orderAdded', order);
        res.status(200).send(order);
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.delete("/order/delete/:id", async(req,res) =>{
    const order = Order.findOneAndDelete({_id:req.params.id});
    try{
         if(!order){
            await res.status(404).send();
        }
        else{
            await res.send(order);
        }
    }
    catch(e){
        res.status(500).send(e);
    }
       
})

router.get("/order/getAll", async(req,res) =>{
   try{
        const orders = await Order.find().populate('products');
        await res.status(200).send(orders);
   }
   catch(e){
        res.status(500).send(e)
   }
})

router.get("/order/get/:id", async(req,res) =>{
    try{
        const order = await Order.findOne({_id:req.params.id});
        await res.status(200).send(order);
    }
    catch(e){
        res.status(500).send(e);
    }
})

router.get("/order/getDailyRevenue", async(req,res)=>{
    const today = Date.now();
    const hoy = new Date(today);
    const hoyAno = hoy.getFullYear();
    const hoyMes = hoy.getMonth();
    const hoyDia = hoy.getDate();
    const orders = await Order.find();
    let sumatorio = 0;
    
    try{
        orders.forEach(order => {
            if(order.date.getFullYear() == hoyAno && order.date.getMonth() == hoyMes && order.date.getDate() == hoyDia){
                sumatorio += order.totalPrice;
            }
            
        });
        res.send({revenue: sumatorio});
    }
    catch(e){
        res.status(500).send(e);
    }
})

router.get("/order/getOrdersOfToday", async(req,res) =>{
    const orders = await Order.find({
        orderStatus: 'pending',
        date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
    }
    ).populate('products');
    try{
        res.status(200).send(orders);
    }
    catch(e){
        res.status(500).send(e);
    }
})

module.exports = router;