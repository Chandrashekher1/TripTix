import React, { useState } from 'react';
import { Login_Api, Register_API } from '../utils/constant';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [number,setNumber] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    try{
      let response
      const url = !isLogin ? Register_API : Login_Api

      if(!isLogin){
        response = await fetch(url,{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify({email,password,name,phone:number})
        })
      }
      else{
        response = await fetch(url, {
          method:'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({email,password})
        })
      }
      const data = await response.json()
      setMessage(data.message)
      console.log(data);
      
      localStorage.setItem('user',data?._id)
      const token = response.headers.get('authorization')
      
      if(token){
        localStorage.setItem('authorization',token)
        navigate('/profile')

        location.reload()
      }
      else {
        throw new Error("No token receive from server")
      }
    }
    catch(err){
      console.log("error",err);
      
    }
  }
  const toggleForm = () => {
    setIsLogin(!isLogin);
  }

  return (
    <div className='flex items-center justify-center h-screen home'>
      <form className="flex flex-col justify-center md:w-[50%] mx-8 bg-white border border-transparent rounded-md shadow-xl p-8 my-16" onSubmit={handleSubmit}>
        <h1 className="text-center font-semibold text-xl">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>

        {!isLogin && (
          <>
            <label className="font-semibold mt-4">Name</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="border px-4 py-2 rounded-md border-gray-200"
            />
          </>
        )}

        <label className="font-semibold mt-4">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          className="border px-4 py-2 rounded-md border-gray-200"
        />

        {!isLogin && (
          <>
            <label className="font-semibold mt-4">Phone Number</label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              placeholder="Enter your phone"
              className="border px-4 py-2 rounded-md border-gray-200"
            />
          </>
        )}

        <label className="font-semibold mt-4">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="border px-4 py-2 rounded-md border-gray-200"
        />

        <button type="submit" className="btn-primary mt-8 font-semibold">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
        
        <p className='text-red-600 my-4'>{message}</p>

        <p className="text-center font-semibold">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            className="cursor-pointer text-blue-500 hover:underline"
            onClick={toggleForm}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
