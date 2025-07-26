import React from 'react'
import Navbar from './Navbar'
import { LuBus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const navigate = useNavigate()

  return (
    <div className='flex justify-between sticky top-0 shadow-lg px-4 md:px-16 py-4 bg-white   z-10'>
        <div className='flex cursor-pointer' onClick={() =>navigate('/') }>
            <h1 className='font-bold text-2xl md:text-2xl  mx-1 md:mx-2 text-black'> <span className='border rounded-lg text-white bg-[#23a983] px-2'>T</span> TripTix</h1>
        </div>
        <div className=''>
            <Navbar/>
        </div>
    </div>
  )
}

export default Header