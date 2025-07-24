import React, { useState } from 'react';
import { IoLocationOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Bus_API, Route_API } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useBus from '../hook/useBus';

const SearchBar = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate();

  const { setBuses, setRouteDetails } = useBus(); 

  const handleSearch = async (e) => {
    e.preventDefault();
    setRouteDetails({ origin, destination, date });
    setIsLoading(true)

    try {
      const routeResponse = await fetch(`${Route_API}origin=${origin}&destination=${destination}`);
      const routeJson = await routeResponse.json();
      if (!routeJson.success) {
        alert("No route found.");
        return;
      }
      const busResponse = await fetch(`${Bus_API}?origin=${origin}&destination=${destination}&date=${date}`);
      const busJson = await busResponse.json();
      setBuses(busJson)
      navigate('/available-seat');
    } catch (err) {
      console.error("Error fetching buses:", err.message);
    }
  };

  return (
    <div className='mx-4 bg-[#060e23] shadow-xl border rounded-lg border-gray-900 px-4 md:flex flex-col items-center py-8 md:mx-40 mb-20'>
      <div>
          <form onSubmit={handleSearch} className='flex flex-col  md:flex-row flex-wrap'>
        <div>
          <label className='flex text-lg font-semibold text-white my-2'>
            <IoLocationOutline style={{ marginTop: '4px', color: "blue", marginRight: '4px', fontSize:'20px' }} /> From
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder='Departure city'
            className='border px-4 py-3 rounded-md border-gray-700 bg-black text-gray-400 focus:outline-blue-700'
            required
          />
        </div>

        <div className='flex justify-center items-center ml-4'>
          <FaArrowRight style={{ color: 'blue' , marginTop:'20px' }} />
        </div>

        <div className='md:mx-8'>
          <label className='flex text-lg font-semibold text-white my-2'>
            <IoLocationOutline style={{ marginTop: '4px', color: 'green', marginRight: '4px' }} /> To
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Destination city'
            className='border px-4 py-3 rounded-md border-gray-800 bg-black text-gray-400 focus:outline-blue-700'
            required
          />
        </div>

        <div>
          <label className='flex text-lg font-semibold text-white my-2'>
            <MdOutlineCalendarToday style={{ marginTop: '4px', marginRight: '2px' }} /> Journey Date
          </label>
          <input
            type="date"
            value={date}
            name='select date'
            min={new Date().toISOString().split("T")[0]}
            placeholder='Select date'
            onChange={(e) => setDate(e.target.value)}
            className='border px-4 py-3 rounded-md border-gray-800 bg-black text-gray-400 focus:outline-blue-700'
            required
          />
        </div>

        <button
          type='submit'
          className='bg-[#21d3ed] flex items-center justify-center font-semibold my-8 py-2 px-4 rounded-md md:mx-8 md:my-12 cursor-pointer hover:bg-cyan-500 min-w-[150px]'
        >
          {isLoading ? (
            <CircularProgress size={24} style={{ color: 'blue' }} />
          ) : (
            <>
              <CiSearch className='mr-2 text-black text-xl' />
              <span className='text-black'>Search Buses</span>
            </>
          )}
        </button>

      </form>
      </div>
      <div>
        <div>
          <h3 className='font-semibold text-white'>Popular Routes:</h3>
        <div className='flex flex-wrap gap-2'>
          <button
            type="button"
            onClick={() => {
              setOrigin('Delhi');
              setDestination('Dehradun');
            }}
            className='flex border border-transparent rounded-md cursor-pointer px-2 py-1 hover:bg-gray-800 bg-gray-900 hover:text-white text-blue-700 font-semibold md:my-2'
          >
            Delhi <IoIosArrowRoundForward style={{ marginTop: '4px', marginLeft: '4px', marginRight: '4px' }} /> Dehradun
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
