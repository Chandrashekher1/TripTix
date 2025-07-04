import React from 'react'
import { IoLocationOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";

const SearchBar = () => {
  return (
    <div className='mx-4'>
        <form action="" className='flex flex-col justify-center border px-4 py-8 border-transparent shadow-xl bg-white'>
            <label htmlFor="" className='flex text-lg font-semibold text-gray-700 my-2'><IoLocationOutline style={{marginTop:'4px', color:"blue", marginRight:'4px'}}/> From</label>
            <input type="text" placeholder='Departure city' className='border px-4 py-3 active:outline-none rounded-md border-gray-400'/>
            <div className='flex justify-center items-center my-4'>
                <FaArrowRight style={{color:'blue'}}/>
            </div>
            <label htmlFor="" className='flex text-lg font-semibold text-gray-700 my-2'><IoLocationOutline style={{marginTop:'4px', color:'green', marginRight:'4px'}}/> To</label>
            <input type="text" placeholder='Destination city' className='border px-4 py-3 active:outline-none rounded-md border-gray-400'/>
            <label htmlFor="" className='flex text-gray-700 font-semibold my-2'><MdOutlineCalendarToday style={{marginTop:'4px', marginRight:'2px'}}/> Journey Date</label>
            <input type="date" placeholder='select date' className='border px-4 py-3 active:outline-none rounded-md border-gray-400 '/>

            <button className='btn-primary cursor-pointer flex font-semibold my-8 justify-center' ><CiSearch style={{fontSize:'20px', marginRight:'8px', marginTop:'2' , fontWeight:'bold'}}/> Search Buses</button>
        </form>

    </div>
  )
}

export default SearchBar