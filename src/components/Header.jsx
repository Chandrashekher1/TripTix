import React from 'react'
import Navbar from './Navbar'
import { LuBus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';


const Header = () => {

  const navigate = useNavigate()

  return (
    <div className='flex justify-between border border-transparent sticky top-0 shadow px-4 md:px-16 py-4 bg-white'>
        <div className='flex cursor-pointer' onClick={() =>navigate('/') }>
            <LuBus style={{color: 'blue' , fontSize:'30px' , marginTop:'4'}}/>
            <h1 className='font-bold text-2xl md:text-3xl btn-secondary mx-1 md:mx-2'>TripTix</h1>
        </div>
        <div className='hidden md:inline-block'>
            <Navbar/>
        </div>
    </div>
  )
}

export default Header