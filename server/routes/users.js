const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwtSecret = require("../config/data.config");
const jwtToken = require("jsonwebtoken");
const User=require('../models/user');

const router = express.Router();
router.post('/register', 
check("name","name should not be empty").notEmpty(),
check("email","email is required").isEmail(),
check("password","password require atleast 6 chars").isLength({min:6}),
async(req, res) => { 
    console.log(jwtSecret);
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg:errors.array()});
    }

    const {name,email,password}=req.body;

    try{
        let user=await User.findOne({email});
        console.log(user!=null)
        if(user){
                    return res.status(400).json({msg:"email already exists"});
                }
              //  console.log('after if condiotn')
                const salt=await bcrypt.genSalt(10);
                const newPassword =await bcrypt.hash(password, salt);
                let user1=new User({
                    name,
                    email,
                    password:newPassword,
                })
                
                await user1.save();
                const payload = {user: {id: user1.id}};
                console.log(payload)
                jwtToken.sign(payload,jwtSecret,{expiresIn:"5days"},(err,token) => {
                    if(err) {
                        throw err;
                    }
                    else  res.json(token);
                })
                //return res.status(201).json({result:"user cretaed successfully"});
    }
    catch(err){
        return res.status(500).json({msg:err.message});
    }
    
});



router.get('/', (req, res) => {
    res.status(200).json({msg:"hello from user"});
});

router.post("/", (req, res) => {
    res.json({msg:"hello from profile"});
});

module.exports=router;