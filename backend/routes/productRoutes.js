const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const Product = require('../models/Product');

router.post('/createproduct',requireLogin,(req,res)=>{
    const {name,description,url,stock,price} = req.body;

    if(!name || !url || !stock){
        return res.status(421).json({
            error:"Enter all the fields!"
        })
    }

    const newProduct = new Product({
        name,
        description,
        url,
        price,
        stock
    });

    newProduct.save()
        .then(product=>{
            res.json({
                product
            })
        }).catch(err=>{
            console.log(err)
        })
});

router.get('/allproduct',requireLogin,(req,res)=>{
    Product.find()
        .then(products=>{
            if(!products){
                return res.status(404).json({
                    error:"Not Found!"
                })
            }
            if(products.length==0){
                return res.json({
                    message:"No products added"
                })
            }
            return res.json(products)
        }).catch(err=>{
            return res.json({error:err})
        })
});

router.get('/product/:productid',requireLogin,(req,res)=>{
    Product.findOne({_id:req.params.productid})
        .then(product=>{
            if(!product){
                return res.status(404).json({
                    error:"Not Found!"
                })
            }
            return res.json(product)
        })
})

router.put('/updateproduct/:productid',requireLogin,(req,res)=>{
    Product.findByIdAndUpdate({_id:req.params.productid},{
        $set:{
            name:req.body.name,
            description:req.body.description,
            url:req.body.url,
            price:req.body.price,
            stock:req.body.stock
        }
    },{new:true},(err,result)=>{
        if(err){
            return res.status(421).json({
                error:err
            })
        }
        return res.json(result)
    })
});

router.delete('/deleteproduct/:productid',requireLogin,(req,res)=>{
    Product.findByIdAndDelete({_id:req.params.productid})
        .then(prod=>{
            if(prod){
                return res.status(200).json({
                    success:prod
                })
            }
            else{
                return res.status(404).json({
                    error:"Not found!"
                })
            }
        }).catch(err=>{
            return res.json({error:err})
        })
});

router.put('/buyproduct/:productid',requireLogin,(req,res)=>{
    Product.findOne({_id:req.params.productid})
        .then(product=>{
            if(!product){
                return res.status(404).json({
                    error:"Not Found!"
                })
            }
            if(product.stock>0) {
                Product.findByIdAndUpdate({_id:req.params.productid},{
                    $set:{
                        stock:product.stock-1
                    }
                },{new:true},(err,result)=>{
                    if(err) throw err
                    return res.json(result)
                })
            }
            else{
                return res.json({
                    error:"Out of Stock!"
                })
            }
        })
});

module.exports = router;