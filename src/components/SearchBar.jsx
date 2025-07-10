import React, { useState } from 'react';
import { IoLocationOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Bus_API, Route_API } from '../utils/constant';
import { useNavigate } from 'react-router-dom';
import useBus from '../hook/useBus';

const SearchBar = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const { setBuses, setRouteDetails } = useBus(); 

  const handleSearch = async (e) => {
    e.preventDefault();

    setRouteDetails({ origin, destination, date });

    try {
      const routeResponse = await fetch(`${Route_API}origin=${origin}&destination=${destination}`);
      const routeJson = await routeResponse.json();
      if (!routeJson.success) {
        alert("No route found.");
        return;
      }

      const busResponse = await fetch(`${Bus_API}origin=${origin}&destination=${destination}&date=${date}`);
      const busJson = await busResponse.json();
      setBuses(busJson)

      navigate('/available-seat');
    } catch (err) {
      console.error("Error fetching buses:", err.message);
    }
  };

  return (
    <div className='mx-4 bg-white shadow-xl border rounded-md border-transparent px-8 py-8 md:mx-40'>
      <div>
          <form onSubmit={handleSearch} className='flex flex-col  md:flex-row flex-wrap'>
        <div>
          <label className='flex text-lg font-semibold text-gray-700 my-2'>
            <IoLocationOutline style={{ marginTop: '4px', color: "blue", marginRight: '4px' }} /> From
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder='Departure city'
            className='border px-4 py-3 rounded-md border-gray-400'
            required
          />
        </div>

        <div className='flex justify-center items-center my-4 md:mx-4'>
          <FaArrowRight style={{ color: 'blue' , marginTop:'20px' }} />
        </div>

        <div className='md:mx-16'>
          <label className='flex text-lg font-semibold text-gray-700 my-2'>
            <IoLocationOutline style={{ marginTop: '4px', color: 'green', marginRight: '4px' }} /> To
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Destination city'
            className='border px-4 py-3 rounded-md border-gray-400'
            required
          />
        </div>

        <div>
          <label className='flex text-gray-700 font-semibold my-2'>
            <MdOutlineCalendarToday style={{ marginTop: '4px', marginRight: '2px' }} /> Journey Date
          </label>
          <input
            type="date"
            value={date}
            name='select date'
            min={new Date().toISOString().split("T")[0]}
            placeholder='Select date'
            onChange={(e) => setDate(e.target.value)}
            className='border px-4 md:px-12 py-3 rounded-md border-gray-400'
            required
          />
        </div>

        <button className='btn-primary flex font-semibold my-8 justify-center md:mx-8 md:my-10 cursor-pointer hover:bg-blue-700' type='submit'>
          <CiSearch style={{ fontSize: '20px', marginRight: '8px' }} /> Search Buses
        </button>

        
      </form>
      </div>
      <div>
            <div>
              <h3 className='font-semibold text-gray-600'>Popular Routes</h3>
        <div className='flex flex-wrap gap-2'>
          <button
            type="button"
            onClick={() => {
              setOrigin('Delhi');
              setDestination('Dehradun');
            }}
            className='flex border border-transparent rounded-full px-4 py-1 bg-blue-100 text-blue-700 font-semibold md:my-2'
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
