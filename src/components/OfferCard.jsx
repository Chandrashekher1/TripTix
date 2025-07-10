import React from 'react'
import { FaPercent } from "react-icons/fa";
import { FiGift } from "react-icons/fi";
import { MdOutlineCalendarToday } from "react-icons/md";

const OfferCard = () => {
  return (
    <div className='mx-4 md:mx-0 md:flex flex-wrap justify-center'>
        <div className='flex flex-col justify-center items-center border border-gray-300 bg-white px-6 py-4 shadow rounded-md hover:border-blue-700 hover:shadow-xl md:mx-4 my-4'>
            <FaPercent style={{color:'orange' , fontSize:'30px'}}/>
            <h1 className='text-lg font-semibold my-4'>Early Bird Special</h1>
            <p className='text-gray-700 text-center '>Book 7 days in advance and save up to 30%</p>
            <button className='my-4 px-8 text-center py-4 rounded-md bg-blue-100 text-gray-700 font-semibold'>Use code: <span className='text-blue-700 font-bold'>EARLY30</span></button>
        </div>
        <div className='flex flex-col justify-center items-center border border-gray-300 bg-white px-6 py-4 shadow rounded-md hover:border-blue-700 hover:shadow-xl md:mx-4 my-4'>
            <FiGift style={{color:'violet' , fontSize:'30px'}}/>
            <h1 className='text-lg font-semibold my-4'>Early Bird Special</h1>
            <p className='text-gray-700 text-center '>New users get 25% off their first booking</p>
            <button className='my-4 px-8 text-center py-4 rounded-md bg-blue-100 text-gray-700 font-semibold'>Use code: <span className='text-blue-700 font-bold'>WELCOME25</span></button>
        </div>
        <div className='flex flex-col justify-center items-center border border-gray-300 bg-white px-6 py-4 shadow rounded-md hover:border-blue-700 hover:shadow-xl md:mx-4 my-4' >
            <MdOutlineCalendarToday style={{color:'green' , fontSize:'30px'}}/>
            <h1 className='text-lg font-semibold my-4'>Weekend Gateway</h1>
            <p className='text-gray-700 text-center '>Special rates for weekend travel </p>
            <button className='my-4 px-8 text-center py-4 rounded-md bg-blue-100 text-gray-700 font-semibold'>Use code: <span className='text-blue-700 font-bold'>WEEKEND15</span></button>
        </div>
    </div>
  )
}

export default OfferCard