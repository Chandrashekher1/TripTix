import React from 'react'
import { CiSearch } from "react-icons/ci";

const TrackBus = () => {
  return (
    <div className='py-8 border-b border-b-gray-800'>
        <h1 className='text-center font-bold text-3xl text-white'>Track Your Bus</h1>
        <p className='text-center text-gray-400 my-2'>Enter your booking ID or bus number to track real-time location</p>

        <div className='md:mx-60 mx-4'>
            <div>
            <form action="" className='flex border border-gray-900 bg-[#060e23] py-6 px-4 my-4 rounded-lg shadow-xl w-full' onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder='Enter booking ID or bus number' className='p-2 rounded-lg border border-gray-800 text-gray-400 focus:outline-blue-600 w-full'/>
                <button className='btn-primary flex font-semibold mx-4 cursor-pointer'><CiSearch style={{marginTop:'4px', marginRight:'4px', fontSize:'20px'}}/> Track</button>
            </form>
        </div>
        </div>
    </div>
  )
}

export default TrackBus