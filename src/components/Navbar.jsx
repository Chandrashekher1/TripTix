import React from 'react'
import { Link } from 'react-router-dom'
import { LuBus, LuUser } from "react-icons/lu";
import { BsBrightnessHigh } from "react-icons/bs";


const Navbar = () => {
  return (
    <div className='flex '>
        <div className='flex  rounded-md px-4 py-2 text-blue-700 font-semibold bg-blue-200 cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mt-1">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
            </svg>
            {/* <searchIcons/> */}
            <Link className='mx-1 text-md'>Search</Link>
        </div>
        <div className='flex  rounded-md px-4 py-2 hover:text-blue-700 mx-4 text-gray-500'>
            <LuBus style={{marginTop:'4', marginLeft:'4'}}/>
            <Link className='mx-1 text-md'>Track Bus</Link>
        </div>
         <div className='flex border border-gray-200 hover:bg-blue-100 rounded-md px-4 py-2 mx-4 cursor-pointer'>
            <LuUser style={{marginTop:'4', marginLeft:'4'}}/>
            <Link className='mx-1 text-md font-semibold'>Sign In</Link>
        </div>
        <div className='flex border border-gray-200 hover:bg-blue-100 rounded-md px-3 py-2 mx-4 cursor-pointer'>
            <BsBrightnessHigh style={{marginTop:'4', marginLeft:''}}/>
        </div>
    </div>
  )
}

export default Navbar