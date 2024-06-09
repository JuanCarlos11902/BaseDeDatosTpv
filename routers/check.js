const express = require("express");
const Check = require("../models/check");
const router = new express.Router();

router.post("/check/add", async(req,res) =>{
    const tmpDate = Date.now();
    const date1 = new Date(tmpDate);
    let totalPrice = 0;
    const check = new Check({
        orders: [],
        totalPrice: totalPrice,
        date: new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds(), date1.getMilliseconds()),
        checkStatus:'pending'
    });
    try{
        await check.save();
        res.status(200).send(check);
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.get("/check/getCheckOfToday", async(req,res) =>{
    const checks = await Check.find({
        date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999))
        },
        checkStatus: 'pending'
    }
    ).populate('orders');
    try{
        if (checks.length == 0) {
            res.send(new Check({
                orders: [],
                totalPrice: 0,
                date: new Date(),
                checkStatus: 'notCreated'
            }));
        }
        else{
            res.send(checks[0]);
        }
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch("/check/update/:id", async(req,res) =>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['totalPrice', 'checkStatus', 'orders'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'});
    }
    
    try{
        const check = await Check.findOne({_id:req.params.id});
        if(!check){
            return res.status(404).send();
        }

        updates.forEach(update => {
            check[update] = req.body[update];
        });

        await check.save();
        res.send(check);
    }
    catch(e){
        res.status(500).send(e);
    }
})

module.exports = router;
