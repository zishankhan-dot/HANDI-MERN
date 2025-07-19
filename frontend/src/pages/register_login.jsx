import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'

import axios from '../api/axios.instance';

const Register = () => {
  const [form, setForm] = useState({ Name: '', Email: '',PhoneNumber:0,Password: '' ,ConfirmPassword:''});
  const [otpverify,setoptverify]=useState("");
  const [user,setuser]=useState("Register") //Register , otp verify ,  Login
  const [otpsent,setotpsent]=useState(false);
  const [message, setMessage] = useState('');
  const navigate=useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });


// post request when user Registering 
  const handleRegister = async e => {
    e.preventDefault();
    try {
      const response =await axios.post('/User/newUser',form);
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      console.log('Full response object:', response);
      setMessage('Please verify Otp !!')
      setuser("otp")
      console.log(user);
      setotpsent(true)
      console.log("Registration successful. Moving to OTP phase.");

    } catch (err) {
      console.error(err)
      setMessage('Registration failed: ' + err.response?.data?.message);
    }
  };

  //post request to verify 6-digit otp 
  const handleotp=async (e)=>{
    e.preventDefault();
    try{
     await axios.post('User/verifyotp',{otp:otpverify,PhoneNumber:form.PhoneNumber});
      setMessage("Otp verified  successfully !!")
      setuser("Login")
      console.log("OTP verified. Moving to login.");


    }
    catch(err){
      setMessage("Otp Verification Failed !!")
    }
  }

  //post request for login to check credentials 
  const handleLogin=async (e)=>{
    e.preventDefault();
    try{
      setMessage("LOGIN OR REGISTER TO CONTINUE TO HANDI")
      await axios.post('User/api/Login',);
      
      navigate("/Dashboard")

    }
    catch(err){
      setMessage("Otp Verification Failed !!")
    }
  }
  



  return (
    <div>
    {user === 'Register' &&(
    <form onSubmit={handleRegister}>
<button onClick={()=>setuser('Register')}><h2>Register</h2> </button><button onClick={()=>setuser('Login')}><h2>LOGIN</h2></button>
      <h2>Register</h2>
      <input name="Name" placeholder="Name" onChange={handleChange} required />
      <input name="Email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="PhoneNumber" type="Number" placeholder="Number" onChange={handleChange} required />
      <input name="Password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="ConfirmPassword" type="password" placeholder="ConfirmPassword" onChange={handleChange} required />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
    )}
    {user==='Login'&&(
      <div>
      <form onSubmit={handleLogin}>
        <h2>LOGIN</h2>
        <input name='email' type='email' placeholder='Email' required></input>
        <input name='password' type='password' placeholder='Password' required></input>
        <button type='submit'>Login</button>
        <br></br>
         {message && <p>{message}</p>}

        
      </form>
      <button onClick={()=>setuser('Register')}><h2>Register</h2> </button><button onClick={()=>setuser('Login')}><h2>LOGIN</h2></button>
      </div>
    )}
    {user==='otp'&&(
      <form onSubmit={handleotp}>
        <h2>Verify OTP</h2>
        <input type='number' placeholder='Enter OTP' onChange={e=>setoptverify(e.target.value)}></input>
        <button type='submit'>Submit</button>
        {message && <p>{message}</p>}
      </form>
    )}
  </div>
  );
};

export default Register;
