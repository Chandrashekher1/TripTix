import React from 'react'
import { CiSearch } from "react-icons/ci";

const TrackBus = () => {
  return (
    <div className='home px-4 py-8'>
        <h1 className='text-center font-bold text-3xl'>Track Your Bus</h1>
        <p className='text-center text-gray-700 my-2'>Enter your booking ID or bus number to track real-time location</p>

        <div>
            <form action="" className='flex border bg-white py-6 px-4 my-4 rounded-md border-gray-100 shadow-xl' onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder='Enter booking ID or bus number' className='p-2 rounded-md border border-gray-200'/>
                <button className='btn-primary flex font-semibold mx-4 '><CiSearch style={{marginTop:'4px', marginRight:'4px', fontSize:'20px'}}/> Track</button>
            </form>
        </div>
        <div className='border border-blue-200 rounded-md bg-blue-50 p-6'>
            <p className='text-blue-700 font-semibold my-2'>Try these sample tracking IDs:</p>
            <div className='flex flex-wrap'>
                <button className='border rounded-full bg-blue-100 p-1 text-blue-700 px-4 border-transparent mx-2'>RR12345678</button>
                <button className='border rounded-full bg-blue-100 p-1 text-blue-700 px-4 border-transparent mx-2'>RR12345678</button>
                <button className='border rounded-full bg-blue-100 p-1 text-blue-700 px-4 border-transparent mx-2 my-2'>RR12345678</button>
            </div>
        </div>
    </div>
  )
}

export default TrackBus