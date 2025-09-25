// import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Footer from './components/Footer'
import AvailableBus from './pages/AvailableBus'
import SeatSelection from './components/SeatSelection'
import PassengerDetails from './pages/PassengerDetails'
import TrackBus from './components/TrackBus'
import Profile from './pages/Profile'
import BusProvider from './context/BusProvider'
import ChatBot from './components/ChatBot'
import OpenPage from './components/OpenPage'

function App() {
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //   const timer = setTimeout(() => setLoading(false), 3000);
    //   return () => clearTimeout(timer);
    // }, []);

    // if (loading) return <OpenPage />;


    return (
    <BusProvider>
        <Router>
        <Header/>
        <div>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/available-seat' element={<AvailableBus/>}/>
            <Route path='/seat-selection/:id' element={<SeatSelection/>}/>
            <Route path='/passenger-details' element={<PassengerDetails/>}/>
            <Route path='/track-bus' element={<TrackBus/>}/>
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
