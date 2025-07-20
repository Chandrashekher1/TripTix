import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Footer from './components/Footer'
import AvailableBus from './pages/AvailableBus'
import SeatSelection from './components/SeatSelection'
import PassengerDetails from './pages/PassengerDetails'
import TrackBus from './components/TrackBus'
import Login from './components/Login'
import Profile from './pages/Profile'
import BusProvider from './context/BusProvider'
import ChatBot from './components/ChatBot'

function App() {

  return (
    <BusProvider>
        <Router>
        <Header/>
        <div className='bg-gray-950'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/available-seat' element={<AvailableBus/>}/>
            <Route path='/seat-selection/:id' element={<SeatSelection/>}/>
            <Route path='/passenger-details' element={<PassengerDetails/>}/>
            <Route path='/track-bus' element={<TrackBus/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/profile' element={<Profile/>}/>
          </Routes>
        </div>
        <Footer/>
        </Router>
        <ChatBot/>
    </BusProvider>
  
  )
}

export default App
