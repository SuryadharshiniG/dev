//token has to validated
//userid should be automaticllu added to req
const jwt=require('jsonwebtoken');
const jwtSecret=require("../config/data.config")

module.exports=(req,res,next)=>{
    const token=req.header('x-auth-token');

    //if token exists or not
    if(!token){
        return res.status(401).json({msg:'No token, authorization denied'});
    }
    try{
        jwt.verify(token,jwtSecret,(error,decoded) =>{
            if(error)
{
    return res.ststus(401).json({msg:"Not valid token"});
}       
           else{
            req.user=decoded.user;
            next();//get updated req and updated response
           } 
        });
    }catch(err){
        res.status(401).json({msg:'Token is not valid'});
    }
};