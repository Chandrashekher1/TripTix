import React, { useContext, useState } from 'react';
import { Login_Api, Register_API } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Login = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const url = isLogin ? Login_Api : Register_API;
      const body = isLogin
        ? { email, password }
        : { email, password, name, phone: number };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const token = response.headers.get('authorization');
      setMessage(data.message);

      if (token) {
        login(token, data?._id);
        navigate('/profile');
        onClose();
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-2 bg-opacity-60 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center text-[#101828]">Welcome to TripTix</h2>
        <p className="text-center text-gray-500 mb-6">Your journey starts here</p>

        <div className="flex mb-6 border border-transparent rounded-lg overflow-hidden text-sm font-semibold">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 cursor-pointer ${
              isLogin ? 'bg-gray-200 text-[#101828]' : 'bg-white text-gray-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 cursor-pointer ${
              !isLogin ? 'bg-gray-200 text-[#101828]' : 'bg-white text-gray-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        {!isLogin && (
          <>
            <label className="font-medium text-black">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full mt-1 mb-4 px-4 py-2 border rounded-md text-gray-500 border-gray-300 shadow focus:outline-[#23a983]"
            />
          </>
        )}

        <label className="font-medium text-black">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full mt-1 mb-4 px-4 py-2 border rounded-md text-gray-500 border-gray-300 shadow focus:outline-[#23a983]"

        />

        {!isLogin && (
          <>
            <label className="font-medium text-black">Phone</label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              placeholder="Phone number"
                className="w-full mt-1 mb-4 px-4 py-2 border rounded-md text-gray-500 border-gray-300 shadow focus:outline-[#23a983]"

            />
          </>
        )}

        <label className="font-medium text-black">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
           className="w-full mt-1 mb-4 px-4 py-2 border rounded-md text-gray-500 border-gray-300 shadow focus:outline-[#23a983]"

        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#23a983] to-[#1ac0a2] text-white font-semibold py-2 rounded-md shadow hover:brightness-110"
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
          <p className="text-sm text-red-500 text-center mt-3">{message}</p>
        )}

        <div className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#23a983] cursor-pointer hover:underline font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
