import React, { useState } from 'react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  }

  return (
    <div>
      <form className="flex flex-col justify-center w-[50%] mx-auto bg-white border rounded-md shadow-lg p-8 my-16">
        <h1 className="text-center font-semibold text-xl">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>

        {!isLogin && (
          <>
            <label className="font-semibold mt-4">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="border px-4 py-2 rounded-md border-gray-200"
            />
          </>
        )}

        <label className="font-semibold mt-4">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="border px-4 py-2 rounded-md border-gray-200"
        />

        {!isLogin && (
          <>
            <label className="font-semibold mt-4">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone"
              className="border px-4 py-2 rounded-md border-gray-200"
            />
          </>
        )}

        <label className="font-semibold mt-4">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="border px-4 py-2 rounded-md border-gray-200"
        />

        <button type="submit" className="btn-primary my-8 font-semibold">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>

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
