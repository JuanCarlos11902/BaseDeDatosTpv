const express = require("express");
const Product = require("../models/producto");
const multer = require('multer');
const router = new express.Router();
const io = require('../socket/socket');
const { ObjectId } = require("mongodb");
const upload = multer();

router.post("/products/add",upload.single('image'), async(req,res) =>{
    try{
        const imageBuffer = req.file.buffer;
        let stringPrecio = req.body.price.toString().replace(",",".");
        let tmpPrice = parseFloat(stringPrecio);
        let availability;
        if (req.body.availability === "True") {
            availability = true;
        }
        else{
            availability = false;
        }
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price:tmpPrice,
            availability: availability,
            image:imageBuffer,
            type:req.body.type
        })
        await product.save();
        if(product.availability){
            io.getIO().emit('productAdded', {product});
        }
        
        res.status(200).send(product);
    }
    catch(e){
        res.status(400).send(e);
    }
})

router.delete("/products/delete/:id", async(req,res) =>{
    const product = await Product.findOneAndDelete({_id:req.params.id});
    try{
         if(!product){
            await res.status(404).send();
        }
        else{
            io.getIO().emit('productDeleted', {_id:product._id});
            await res.send(product);
        }
    }
    catch(e){
        res.status(500).send(e);
    }
       
})

router.get("/products/getAll", async(req,res) =>{
   try{
        const products = await Product.find({});
        await res.status(200).send(products);
   }
   catch(e){
        res.status(500).send(e)
   }
})

router.get("/products/getAllIfAvailabilityIsTrue",async(req,res) =>{
    try{
        const products = await Product.find({availability:true});
        res.status(200).send(products);
    }
    catch(e){
        res.status(500).send(e);
    }
})

router.patch("/products/updateProduct/:id", upload.single('image'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "description", "price", "availability", "type"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(500).send("Invalid Operations");
    }

    const objectId = ObjectId.createFromHexString(req.params.id);

    try {
        let stringPrecio = req.body.price.toString().replace(",", ".");
        let tmpPrice = parseFloat(stringPrecio);
        req.body.price = tmpPrice;

        req.body.availability = req.body.availability === "True" ? true : false;

        const product = await Product.findOne({ _id: objectId });
        if (!product) {
            return res.status(404).send();
        }

        updates.forEach(update => {
            product[update] = req.body[update];
        });

        if (req.file) {
            product.image = req.file.buffer;
        }

        await product.save();
        io.getIO().emit('productUpdated', { product });
        res.send(product);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch("/products/changeAvailability/:id",async(req,res) =>{

    try{
        const product = await Product.findOne({_id:req.params.id});
        product.availability = !product.availability;
        await product.save();
        res.send(product);
        io.getIO().emit('productUpdated', {product});
    }
    catch(e){
        res.status(500).send(e);
    }
    
})

module.exports = router;
