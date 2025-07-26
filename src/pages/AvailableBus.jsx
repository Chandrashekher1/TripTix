import React, { useEffect, useState } from 'react';
import { available_gif, Bus_API } from '../utils/constant';
import useBus from '../hook/useBus';
import { FaStar } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoLocationOutline } from "react-icons/io5";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const AvailableBus = () => {
  const searchData = useBus();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    if (searchData?.routeDetails.origin && searchData?.routeDetails.destination) {
      fetchBus();
    } else {
      navigate('/');
    }
  }, [searchData, navigate]);

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

  const renderSkeleton = () => (
    <Box className="max-w-5xl mx-auto mb-6 p-4 bg-green-100 rounded-xl border border-transparent">
      <Skeleton variant="text" width={150} height={30} sx={{ bgcolor: 'grey.100' }} />
      <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: 'grey.100', my: 1 }} />
      <Skeleton variant="rectangular" height={40} sx={{ bgcolor: 'grey.100', my: 2 }} />
      <Skeleton variant="text" width={200} height={30} sx={{ bgcolor: 'grey.100', my: 1 }} />
      <Skeleton variant="rectangular" height={40} sx={{ bgcolor: 'grey.100', mt: 2 }} />
    </Box>
  );

  return (
    <div className="bg-[#f5fefa] py-4 px-2 md:px-12">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <img
            src={`${available_gif}`}
            alt="Loading..."
            className="h-[50vh] w-[50vw]"
          />
        </div>
      ) : (
        <>
          <div className='bg-white text-black rounded-lg p-3 flex items-center flex-wrap gap-2 justify-center mb-4 border border-transparent shadow-lg'>
            <IoLocationOutline className='text-xl' />
            <span className='font-semibold text-xl'>{searchData?.routeDetails.origin}</span>
            <IoIosArrowRoundForward className="text-2xl" />
            <span className='font-semibold text-xl'>{searchData?.routeDetails.destination}</span>
            <span className='text-xl ml-4'>Date: {searchData?.routeDetails.date}</span>
          </div>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i}>{renderSkeleton()}</div>)
          ) : buses.length === 0 ? (
            <p className="text-center text-white bg-gray-800 py-8 rounded-md">
              No buses available for this route.
            </p>
          ) : (
            buses.map((bus, index) => (
              <div
                key={index}
                className="bg-white text-black rounded-xl shadow-xl hover:-translate-y-1 duration-300 p-4 mb-6 max-w-5xl mx-auto border border-transparent"
              >
                <div className="flex justify-between items-center mb-2 flex-wrap">
                  <div>
                    <h2 className="font-bold text-lg">{bus.name || bus.operator}</h2>
                    <p className="text-sm text-gray-700">
                      {bus.isAc ? "AC" : "Non-AC"} {bus.isSleeper ? "Sleeper" : "Seater"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[#059468] text-sm font-semibold">
                    <FaStar /> 4.5
                  </div>
                </div>

                <div className="flex justify-between items-center flex-wrap text-sm mb-4">
                  <div className="font-medium text-lg">
                    {new Date(bus.dep_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-gray-700 text-center border-b border-b-gray-700">
                    {getDuration(bus.dep_time, bus.arrivalTime)}
                  </div>
                  <div className="font-medium text-lg">
                    {new Date(bus.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm mb-3">
                  {bus.isWifi && <div className="bg-green-100 text-[#059669] px-2 rounded-full">Wifi</div>}
                  <div className="bg-green-100 text-[#059669] px-2 rounded-full">Charging</div>
                  {bus.isAc && <div className="bg-green-100 text-[#059669] px-2 rounded-full">AC</div>}
                  <div className="bg-green-100 text-[#059669] px-2 rounded-full">Entertainment</div>
                </div>

                <div className="flex justify-between items-center flex-wrap mt-4">
                  <div className="flex items-center text-green-900 font-semibold text-sm mb-2 md:mb-0">
                    <TbUsers className="text-lg mr-1" />
                    {bus.totalSeat} seats left
                  </div>
                  <div className="text-right">
                    <p className='text-gray-700 text-sm'>Starting from</p>
                    <p className='text-xl font-bold text-black'>₹ {bus.price}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSeat(bus._id)}
                  className="mt-4 w-full bg-[#059468] hover:bg-green-800 transition-colors text-white py-2 rounded-lg font-semibold cursor-pointer"
                >
                  Select Seats
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default AvailableBus;
