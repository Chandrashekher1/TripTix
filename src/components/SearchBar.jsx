import React, { useState } from 'react';
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineCalendarToday } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { Bus_API, Route_API } from '../utils/constant';
import useBus from '../hook/useBus';

const SearchBar = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setBuses, setRouteDetails } = useBus();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setRouteDetails({ origin, destination, date });

    try {
      const routeResponse = await fetch(`${Route_API}origin=${origin}&destination=${destination}`);
      const routeJson = await routeResponse.json();
      if (!routeJson.success) {
        alert("No route found.");
        setIsLoading(false);
        return;
      }

      const busResponse = await fetch(`${Bus_API}?origin=${origin}&destination=${destination}&date=${date}`);
      const busJson = await busResponse.json();
      setBuses(busJson);
      navigate('/available-seat');
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="w-full px-4 ">
    <div className="bg-white md:shadow-2xl rounded-xl p-4 px-6  max-w-6xl mx-auto -mt-40 z-10 relative">
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6"
      >
        <div className="flex-1">
          <label className="block mb-1 font-semibold text-gray-700 flex items-center">
            <IoLocationOutline className="mr-1 text-green-600" />
            From
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 px py-2.5 border rounded-md bg-green-50 focus:outline-[#23a983]"
            required
          >
            <option value="" disabled className='hover:bg-[#23a983]'>Select origin</option>
            <option value="Delhi" className='hover:bg-[#23a983]'>Delhi</option>
            <option value="Mumbai">Mumbai</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block mb-1 font-semibold text-gray-700 flex items-center">
            <IoLocationOutline className="mr-4 text-cyan-600" />
            To
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-md bg-gray-50 focus:outline-[#23a983]"
            required
          >
            <option value="" disabled className='hover:bg-[#23a983]'>Select destination</option>
            <option value="Dehradun">Dehradun</option>
            <option value="Jaipur">Jaipur</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block mb-1 font-semibold text-gray-700 flex items-center">
            <MdOutlineCalendarToday className="mr-1 text-gray-600" />
            Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-md bg-gray-50 focus:outline-[#23a983]"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="bg-[#23a983] hover:bg-[#1db179] transition-all text-white w-full py-3 px-6 rounded-md flex justify-center items-center font-semibold shadow-md cursor-pointer"
          >
            {isLoading ? (
              <CircularProgress size={20} style={{ color: 'white' }} />
            ) : (
              <>
                <CiSearch className="mr-2 text-lg" />
                Search Buses
              </>
            )}
          </button>
        </div>
      </form>

      {/* <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-2">Popular Routes:</h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setOrigin('Delhi');
              setDestination('Dehradun');
            }}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-[#23a983] hover:bg-green-50 font-medium flex items-center"
          >
            Delhi <IoIosArrowRoundForward className="mx-2 text-gray-600" /> Dehradun
          </button>
        </div>
      </div> */}
    </div>
  </div>
)
}


export default SearchBar;
