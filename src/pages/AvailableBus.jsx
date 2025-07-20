import React, { useEffect, useState } from 'react';
import { Bus_API } from '../utils/constant';
import useBus from '../hook/useBus';
import { FaStar } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoLocationOutline } from "react-icons/io5";
import { FaWifi, FaBolt } from 'react-icons/fa';
import { MdAcUnit, MdOutlineTheaters } from 'react-icons/md';

const AvailableBus = () => {
  const searchData = useBus();
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  const handleSeat = (id) => {
    navigate(`/seat-selection/${id}`);
  };

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await fetch(
          `${Bus_API}?origin=${searchData.routeDetails.origin}&destination=${searchData.routeDetails.destination}`
        );
        const json = await res.json();
        setBuses(json);
      } catch (err) {
        console.error("Error fetching bus:", err.message);
      }
    };

    if (searchData?.routeDetails.origin && searchData?.routeDetails.destination) {
      fetchBus();
    } else {
      navigate('/');
    }
  }, [searchData]);

  const getDuration = (depTime, arrTime) => {
    const dep = new Date(depTime);
    let arr = new Date(arrTime);
    if (isNaN(dep) || isNaN(arr)) return '--';
    if (arr < dep) arr.setDate(arr.getDate() + 1);
    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-gray-950 py-4 px-2 md:px-12 border-b border-b-gray-800">
      <div className='bg-gray-900 text-gray-300 rounded-md p-3 flex items-center flex-wrap gap-2 justify-center mb-4 border border-gray-700'>
        <IoLocationOutline className='text-xl' />
        <span className='font-semibold'>{searchData?.routeDetails.origin}</span>
        <IoIosArrowRoundForward className="text-2xl" />
        <span className='font-semibold'>{searchData?.routeDetails.destination}</span>
        <span className='text-sm ml-4'>Date: {searchData?.routeDetails.date}</span>
      </div>

      {buses.length === 0 ? (
        <p className="text-center text-white bg-gray-800 py-8 rounded-md">No buses available for this route.</p>
      ) : (
        buses.map((bus, index) => (
          <div key={index} className="bg-[#0f172a] text-white rounded-xl shadow-lg p-4 mb-6 max-w-5xl mx-auto border border-gray-800">
            <div className="flex justify-between items-center mb-2 flex-wrap">
              <div>
                <h2 className="font-bold text-lg">{bus.name || bus.operator}</h2>
                <p className="text-sm text-gray-400">{bus.isAc ? "AC" : "Non-AC"} {bus.isSleeper ? "Sleeper" : "Seater"}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                <FaStar /> 4.5
              </div>
            </div>

            <div className="flex justify-between items-center flex-wrap text-sm mb-4">
              <div className="font-medium text-lg">
                {new Date(bus.dep_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-gray-400 text-center">
                {getDuration(bus.dep_time, bus.arrivalTime)}
              </div>
              <div className="font-medium text-lg">
                {new Date(bus.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-3">
              {bus.isWifi && <div className="flex items-center gap-1"><FaWifi /> WiFi</div>}
              <div className="flex items-center gap-1"><FaBolt /> Charging</div>
              {bus.isAc && <div className="flex items-center gap-1"><MdAcUnit /> AC</div>}
              <div className="flex items-center gap-1"><MdOutlineTheaters /> Entertainment</div>
            </div>

            <div className="flex justify-between items-center flex-wrap mt-4">
              <div className="flex items-center text-green-400 font-semibold text-sm mb-2 md:mb-0">
                <TbUsers className="text-lg mr-1" />
                {bus.totalSeat} seats left
              </div>
              <div className="text-right">
                <p className='text-gray-400 text-sm'>Starting from</p>
                <p className='text-xl font-bold text-white'>₹ {bus.price}</p>
              </div>
            </div>
            <button
              onClick={() => handleSeat(bus._id)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded-lg font-semibold cursor-pointer"
            >
              Select Seats
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AvailableBus;
