import React, { useContext, useState } from 'react';
import { Login_Api, Register_API } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Login = ({onClose}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true)

    try {
      let response;
      const url = !isLogin ? Register_API : Login_Api;

      if (!isLogin) {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, phone: number }),
        });
      } else {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await response.json();
      setMessage(data.message);
      const token = response.headers.get('authorization');
      if (token) {
        login(token, data?._id);
        navigate('/profile');
        onClose()
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <form
      className="flex flex-col w-full max-w-md bg-[#060e23] text-white rounded-lg shadow-xl p-6"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center font-bold text-2xl mb-4">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>

      {!isLogin && (
        <>
          <label className="text-sm font-medium mt-2">Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="bg-[#0e1a3a] border border-gray-700 text-white px-4 py-2 rounded-md mt-1"
          />
        </>
      )}

      <label className="text-sm font-medium mt-3">Email</label>
      <input
        type="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="bg-[#0e1a3a] border border-gray-700 text-white px-4 py-2 rounded-md mt-1"
      />

      {!isLogin && (
        <>
          <label className="text-sm font-medium mt-3">Phone</label>
          <input
            type="tel"
            value={number}
            required
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Your phone"
            className="bg-[#0e1a3a] border border-gray-700 text-white px-4 py-2 rounded-md mt-1"
          />
        </>
      )}

      <label className="text-sm font-medium mt-3">Password</label>
      <input
        type="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
        className="bg-[#0e1a3a] border border-gray-700 text-white px-4 py-2 rounded-md mt-1"
      />

      <button
          type="submit"
          className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold py-2 rounded-md shadow-lg transition-all cursor-pointer w-full"
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} color="inherit" />
            </Box>
          ) : (
            isLogin ? 'Sign In' : 'Sign Up'
          )}
      </button>


      {message && (
        <p className="text-red-500 text-sm text-center mt-3">{message}</p>
      )}

      <p className="text-center mt-4 text-sm">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span
          className="text-blue-400 hover:underline cursor-pointer"
          onClick={toggleForm}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </span>
      </p>
    </form>
  );
};

export default Login;
