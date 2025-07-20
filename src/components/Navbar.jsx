import React from 'react'
import { Link } from 'react-router-dom'
import { LuBus, LuUser } from "react-icons/lu";
import { BsBrightnessHigh } from "react-icons/bs";
import { FaRegMoon } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { token } from '../utils/constant';


const Navbar = () => {
  return (
    <div className='flex dark'>
        <div className='flex  rounded-md px-4 py-2 text-blue-700 font-semibold btn-primary cursor-pointer'>
            <IoIosSearch style={{fontSize:'20px' , marginTop:'3px'}}/>
            <Link className='mx-1 text-md' to="/">Search</Link>
        </div>
        <div className='flex  rounded-md px-4 py-2 hover:text-blue-700 mx-4 text-white'>
            <LuBus style={{marginTop:'4', marginLeft:'4'}}/>
            <Link className='mx-1 ' to="track-bus">Track Bus</Link>
        </div>
         <div className='flex borde rounded-md px-4 py-2 cursor-pointer text-white hover:text-blue-700'>
            <LuUser style={{marginTop:'4', marginLeft:'4'}}/>
            {token ? (<Link className='mx-1 text-md font-semibold' to="/profile"> Profile</Link>) : (<Link className='mx-1 text-md font-semibold' to="/login"> Sign In</Link>) }
        </div>
        
    </div>
  )
}

export default Navbar