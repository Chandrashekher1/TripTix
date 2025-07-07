import React from 'react'
import { MdOutlineSecurity } from "react-icons/md";
import { MdOutlineWatchLater } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
const WhyChoose = () => {
  return (
    <div className='mx-4'>
        <div className='flex flex-col justify-center items-center'>
            <span className='rounded-full p-4 bg-blue-100'><MdOutlineSecurity style={{color:'blue', fontSize:'40px'}}/></span>
            <h2 className='text-center font-semibold text-xl my-4'>Safe & Secure</h2>
            <p className='text-center text-gray-700'>Your safety is our priority with verified operators and secure payments</p>
        </div>
       <div className='flex flex-col justify-center items-center my-4'>
            <span className='rounded-full p-4 bg-green-100'><MdOutlineWatchLater style={{color:'green', fontSize:'40px'}}/></span>
            <h2 className='text-center font-semibold text-xl my-4'>On-Time Service</h2>
            <p className='text-center text-gray-700'>Real-time tracking ensures you never miss your bus</p>
        </div>
        <div className='flex flex-col justify-center items-center my-4'>
            <span className='rounded-full p-4 bg-orange-100'><FaRegStar style={{color:'orange', fontSize:'40px'}}/></span>
            <h2 className='text-center font-semibold text-xl my-4'>Best Prices</h2>
            <p className='text-center text-gray-700'>Compare  prices and get best deals on every route</p>
        </div>
    </div>
  )
}

export default WhyChoose