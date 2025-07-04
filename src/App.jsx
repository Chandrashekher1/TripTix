import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'

function App() {

  return (
    <Router>
      <Header/>
      <div>
        <Routes>
           <Route path='/' element={<Home/>}/>
        </Routes>
      </div>
    </Router>
  
  )
}

export default App
