const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SECRET} = require("../key");
const requireLogin = require('../middleware/requireLogin');

router.post('/signup',(req,res)=>{
    const {name,username,password} = req.body;
    if(!name || !username || !password){
        return res.status(401).json({
            error:"Provide all credentials!"
        });
    }

    User.findOne({username:username})
        .then(user => {
            if(user) {
                return res.status(422).json({
                    error:'You are already registered kindly login!'
                })
            }
            bcrypt.hash(password,12)
                .then(hashedpassword=>{
                    const newuser = new User({
                        name,
                        username,
                        password:hashedpassword
                    })
                    newuser.save()
                        .then(
                            res.json({
                                name,
                                username
                            }) 
                        )
                })
        })
})

router.post('/login',(req,res)=>{
    const {username,password} = req.body;
    User.findOne({username:username})
        .then(user=>{
            if(!user){
                return res.status(422).json({
                    error:"Username not registered signup first!"
                })
            }
            bcrypt.compare(password,user.password)
                .then(match=>{
                    if(match){
                        const token = jwt.sign({username:user.username,name:user.name},SECRET);
                        const {name,username} = user;
                        return res.json({
                            user:{
                            name,
                            username
                            },
                            token:"Bearer "+token
                        })
                    }
                    else{
                        return res.status(422).json({
                            error:"Invalid username or password!"
                        })
                    }
                })
                .catch(err=>console.log(err))
        }).catch(err=>console.log(err))
});

router.get('/user',requireLogin,(req,res)=>{
    return res.json(req.user)
})

module.exports = router;