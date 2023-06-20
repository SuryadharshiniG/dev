import React, { useState } from 'react'
import api from '../../utils/api';
const Login = () => {

    const initialState={
        email:"",
        password:""
      }

    const Login = () => {
        const[errorData, setErrorData]=useState({
        });
        const [formdata,setFormdata]=useState(initialState);
      
        const onChange=(e)=>{
          setFormdata({...formdata,[e.target.name]:e.target.value});
      
        };


        const loginSubmit = async(e) => {
            e.preventDefault();
            console.log("Login success");
            console.log(JSON.stringify(formdata));
        
             await api.post("/auth",formdata)
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
         } );
          
        };
        return (
            <> <section class="container">
            <h1 class="large text-primary">Sign Up</h1>
            <p class="lead"><i class="fas fa-user"></i> Create Your Account</p>
            <form class="form" onSubmit={loginSubmit}>
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
              <input type="submit" class="btn btn-primary" value="Login" />
            </form>
          </section></>
          )
        
      }  }
        export default Login;