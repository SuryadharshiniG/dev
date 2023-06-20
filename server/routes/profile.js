// register the user

const express = require("express");
const normalizeURL = require("normalize-url");
const router = express.Router();
const{check,validationResult} =require("express-validator");
const profileModel=require("../models/profile");
const auth=require("../middleware/auth");
const userModel=require("../models/user");
//const profile = require("../models/profile");
//const education=require("../models/profile");
//@route : /profile
// @method : get
//@access : public
//@description : used for testing purpose. share the deatils of all.
router.get("", (req, res) => {
  res.json({ msg: "hello from profile" });
});

router.post("/", check("status","status should not be empty").notEmpty(),check("skills","skills should not be empty").notEmpty(),auth,

async (req, res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const {
    website,
    skills,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
    ...rest
    }=req.body;
  
  
  
  const profileFields={
    user:req.user.id,
    website:website && website!==""? normalizeURL(website,{
      forceHttps:true})
      :"",
      skills:Array.isArray(skills)? skills:skills.split(",").map((s)=> ""+s.trim()),
    ...rest, 
   };
  
  
    const socialFields={linkedin,facebook,instagram,twitter,youtube};
    for(const[key, value] of Object.entries(socialFields)){
      socialFields[key] = normalizeURL(value,{
        forceHttps:true
      });                                                                                                              
    }

    //update the profile details
    profileFields.social=socialFields;
    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await profileModel.findOneAndUpdate(
       // { user:" "},
       {}, 
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
});
//get profile details
router.get("/",async(req, res)=> {
  try{
    const profiles=await profileModel.find();
    res.json(profiles);
  }
  catch(err){
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

//delete the user profile
router.delete("/",auth,async(req, res) => {
  try{
   await Promise.all([profileModel.findOneAndRemove({id})]);
  }
  catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });
//msg form user's profile
router.get ("/me",auth,async (req, res) => {
  try{
    const profile=await profileModel.findOne({
      user:req.user.id
    }).populate('user',['name']);
    if(!profile){
      return res.status(400).json({msg:"profile not found"});
    }
    res.json(profile);
  }
  catch(err){
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

//get specific user's profile
router.get ("/user/:userID", ({params:{userID}},res) => {
  res.json({userID});
});

//delete user profile
router.delete("/me",auth, async(req, res) => {
  try{
    await Promise.all([profileModel.findOneAndRemove({user:req.user.id}),
      userModel.findOneAndRemove({_id:req.user.id}),
    ]);
  res.json({msg:"delete from profile"});
}
  catch(err){
      console.error(err.message);
      res.status(500).send('Server Error');
  }
    });

//should update user profile part

router.put("/experience",auth,
check("title","Title is required").notEmpty(),
check("company","Company name is required").notEmpty(),
check("from","From date is required").notEmpty()
.custom((value,{req})=>(req.body.to ? value<req.body.to:true)),
async(req, res) => {
  const error=validationResult(req);
  if(!error.isEmpty()){
      return res.status(400).json({error:error.array()});
    }
    try{
      const profile=await profileModel.findOne({user:req.user.id});
      console.log(profile)
      profile.experience.unshift(req.body);
      await profile.save();
      res.json(profile);
    }
    catch(err){
      console.error(err.message);
      res.status(500).send('Server Error'+err.message);
    }
});

//delete on basis of id

router.delete("/experience/:expId", auth,async (req, res) => {
 try{
  const foundProfile=await profileModel.findOne({user:req.user.id});
  foundProfile.experience=foundProfile.experience.filter(exp=>exp._id.toString()!==req.params.expId);

  await foundProfile.save();
  return res.status(200).json(foundProfile);
 }
 catch(err) {
  res.json({msg:"delete from profile"});
}
});

//put education details in profile

router.put("/education",auth,
check("school","School is required").notEmpty(),
check("degree","Degree is required").notEmpty(),
check("fieldofstudy","Field of study is required").notEmpty(),
check("from","From is required").notEmpty(),
//custom((value,{req})=>(req.body.to ? value<req.body.to:true)),
async(req, res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
    try{
      const profile=await profileModel.findOne({user:req.user.id});
      profile.education.unshift(req.body);
      await profile.save();
      return res.json(profile);
    }
    catch(err){
          console.error(err.message);
          res.status(500).send('Server Error'+err.message);
        }
}
)
 
//delete on basis of education profile

router.delete("/education/:eduId", auth,async (req, res) => {
  try{
   const foundProfile=await profileModel.findOne({user:req.user.id});
   foundProfile.experience=foundProfile.experience.filter(exp=>exp._id.toString()!==req.params.eduId);
 
   await foundProfile.save();
   return res.status(200).json(foundProfile);
  }
  catch(err) {
   res.json({msg:"delete from profile"});
 }
 });
 
//delete on basis of skills profile
 
module.exports = router;
