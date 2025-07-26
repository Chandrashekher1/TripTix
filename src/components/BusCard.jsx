import React, { useEffect, useState } from 'react';
import useBus from '../hook/useBus';
import { useNavigate } from 'react-router-dom';
import { Bus_API } from '../utils/constant';
import { IoLocationOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const BusCard = () => {
  const [listOfBuses, setListOfBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchData = useBus();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`${Bus_API}/topRated`);
        if (!response.ok) throw new Error("Failed to fetch bus data");
        const json = await response.json();
        setListOfBuses(json || []);
      } catch (err) {
        console.log("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, []);

  const handleBookNow = (bus) => {
    if (!bus || !bus.routesId) return;

    const route = {
      origin: bus.routesId.origin || "",
      destination: bus.routesId.destination || "",
    };

    searchData?.setRouteDetails?.(route);
    navigate('/available-seat');
  };

  function formatTime(time) {
    return new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const renderSkeletonCard = (index) => (
    <Box key={index} sx={{ width: 360, margin: 2, padding: 2, backgroundColor: '#f3f4f6', borderRadius: 2 }}>
      <Skeleton variant="text" width="90%" height="0%" sx={{ bgcolor: 'grey.700' }} />
      <Skeleton variant="text" width="60%" height={30} sx={{ bgcolor: 'grey.100' }} />
      <Skeleton variant="text" width="80%" height={25} sx={{ bgcolor: 'grey.100', my: 1 }} />
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ bgcolor: 'grey.100', my: 1 }} />
      <Skeleton variant="text" width="50%" height={20} sx={{ bgcolor: 'grey.100', my: 1 }} />
      <Skeleton variant="rectangular" width="100%" height={36} sx={{ bgcolor: 'grey.100', my: 2 }} />
    </Box>
  );

  return (
    <div className="md:mx-4 flex flex-wrap justify-center md:p-16">
      {loading
        ? [...Array(3)].map((_, index) => renderSkeletonCard(index))
        : listOfBuses.map((bus, index) => (
          <div
            key={index}
            className="w-96 shadow-lg cursor-pointer md:mx-4 mx-2 my-4 md:p-2 rounded-lg border border-transparent transition duration-300 hover:-translate-y-1"
          >
            <div className="p-4">
              <img src="src/assets/bus.png" alt="" className='rounded-md h-[30vh] w-full' />
              <h1 className="font-semibold text-lg">{bus?.operator || "Luxury Express"}</h1>
              <p className="font-semibold flex border px-2 py-2 rounded-md bg-gray-50 border-transparent shadow my-2">
                <span className='mx-1'><IoLocationOutline className='my-1 font-bold text-lg' /></span>
                {bus?.routesId?.origin || "Unknown"} <FaArrowRightLong className='my-1 mx-2' /> {bus?.routesId?.destination || "Unknown"}
              </p>
              <div className='flex justify-between my-4'>
                <p className='flex flex-col font-bold'>
                  {formatTime(bus?.dep_time)}
                  <span className='text-gray-700 font-normal text-sm'>Departure</span>
                </p>
                <p className='flex flex-col  font-bold'>
                  {formatTime(bus?.arrivalTime)}
                  <span className='text-gray-700 font-normal text-sm'>Arrival</span>
                </p>
              </div>
              <div className="flex flex-wrap my-2">
                {bus.isAc && <p className="bg-green-100 text-[#059669] text-sm rounded-full px-2 py-1 mr-2">AC</p>}
                {bus.isSleeper && <p className="bg-green-100 text-[#059669] text-sm rounded-full px-2 py-1 mr-2">Sleeper</p>}
                {bus.isSeater && <p className="bg-green-100 text-[#059669] text-sm rounded-full px-2 py-1 mr-2">Seater</p>}
                {bus.isWifi && <p className="bg-green-100 text-[#059669] text-sm rounded-full px-2 py-1 mr-2">WiFi</p>}
              </div>
              <div className="flex justify-between items-center mt-4 border-t border-t-gray-200 pt-2">
                <p className="flex flex-col font-bold text-2xl text-[#23a983]">
                  ₹{bus?.price || 0}
                  <span className='text-gray-700 text-sm font-semibold'>per person</span>
                </p>
                <button
                  className="bg-[#23a983] shadow-md hover:scale-105 cursor-pointer font-semibold py-2 px-4 rounded-full transition-all text-white"
                  onClick={() => handleBookNow(bus)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default BusCard;
