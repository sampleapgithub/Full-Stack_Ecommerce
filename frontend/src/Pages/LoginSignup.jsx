import React, {useState} from 'react'
import './CSS/LoginSignup.css'

const LoginSignUp = () => {
  const [state,setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
  }

  const login = async () => {
    console.log("Login function executed,",formData);
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers:{Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
    })
    .then(res => res.json())
    .then(data => responseData=data);

    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    }else{
      alert(responseData.error);
    }
  };

  const signUp = async () => {
    console.log("Signup function executed",formData);
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers:{Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => responseData=data);

    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    }else{
      alert(responseData.error);
    }
  };

  return (
      <div className='login-signup'>
      <div className="login-signup-container">
        <h1>{state}</h1>
        <div className="login-signup-fields">
          {state==="Sign Up"? <input type="text" name='username' value={formData.username} onChange={changeHandler} placeholder='Enter Name'/>:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Enter Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Enter Password' />
        </div>

        <button onClick={() => {state==="Login"?login():signUp()}}>Continue</button>
        {state==="Sign Up"
         ?<p className='login-signup-login'>Already have an account? <span onClick={() => {setState('Login')}}>Login here</span></p>
         :<p className='login-signup-login'>Create an account <span onClick={() => {setState('Sign Up')}}>Click here</span></p>
        }
        <div className="login-signup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};
export default LoginSignUp;
