import React, { useState } from 'react'
import api from '../../utils/api';



const initialState={
  name:"",
  email:"",
  password:"",
  password2:""
}
const Register = () => {
  const[errorData, setErrorData]=useState({
  });
  const [formdata,setFormdata]=useState(initialState);

  const onChange=(e)=>{
    setFormdata({...formdata,[e.target.name]:e.target.value});

  };
   const registerSubmit = async(e) => {
    e.preventDefault();
    console.log("Register message sent");
    console.log(JSON.stringify(formdata));

     await api.post("/users/register",formdata)
     .then((res)=>console.log(res))
     .catch((err)=>{ 
      let errObj={};
      console.log(err.response.data.msg);
    err.response.data.msg.forEach((e) =>{
      console.log(e);
      errObj = {...errObj,[e.path]:e.msg};
    });
    console.log("error object"+ JSON.stringify(errObj));
    setErrorData({...errObj,});
    });

   };
  return (
    <> <section class="container">
    <h1 class="large text-primary">Sign Up</h1>
    <p class="lead"><i class="fas fa-user"></i> Create Your Account</p>
    <form class="form" onSubmit={registerSubmit}>
      <div class="form-group">
        <input type="text" placeholder="Name" name="name" required value={formdata.name} onChange={onChange}/>
        <div class="d-block invalid-feedback">
          {errorData.name}
        </div>
      </div>
      <div class="form-group">
        <input type="email" placeholder="Email Address" name="email" value={formdata.email} onChange={onChange}/>
        <div class="d-block invalid-feedback">
          {errorData.email}
        </div>
        <small class="form-text"
          >This site uses Gravatar so if you want a profile image, use a
          Gravatar email</small
        >
      </div>
      <div class="form-group">
        <input
          type="password"
          placeholder="Password"
          name="password"
          minLength="6"
          value={formdata.password}
          onChange={onChange}
        />
        <div class="d-block invalid-feedback">
          {errorData.password}
        </div>
      </div>
      <div class="form-group">
        <input
          type="password"
          placeholder="Confirm Password"
          name="password2"
          minLength="6"
          value={formdata.password2}
          onChange={onChange}
        />
      </div>
      <input type="submit" class="btn btn-primary" value="Register" />
    </form>
    <p class="my-1">
      Already have an account? <a href="login.html">Sign In</a>
    </p>
  </section></>
  )
}

export default Register;