import { createContext, useState, useEffect } from 'react';
import React from 'react'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authorization') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);


  const login = (newToken,newUser) => {
    localStorage.setItem('authorization', newToken);
    localStorage.setItem('userId', newUser);
    setToken(newToken);
    setUserId(newUser)
  };

  const logout = () => {
    localStorage.removeItem('authorization');
    localStorage.removeItem('userId')
    setToken('');
    setUserId(null)
  };

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('authorization'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ token,userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;