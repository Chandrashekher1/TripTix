import React, { useEffect, useState } from 'react';
import useBus from '../hook/useBus';
import { useNavigate } from 'react-router-dom';
import { Bus_API } from '../utils/constant';
import { IoLocationOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";

const BusCard = () => {
  const [listOfBuses, setListOfBuses] = useState([]);
  const searchData = useBus();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`${Bus_API}/topRated`);
        if (!response.ok) throw new Error("Failed to fetch bus data");
        const json = await response.json();
        console.log(json);
        
        setListOfBuses(json || []);
      } catch (err) {
        console.log("Error:", err.message);
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

  if (listOfBuses.length === 0) {
    return (
      <div className="mx-4 mt-8 text-center text-gray-600 font-medium">
        No top-rated buses found.
      </div>
    );
  }

  function deptTime(time){
    const departureTime = new Date(time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
    })  
    return departureTime 
  }
  function arriveTime(time) {
    const ArrivalTime = new Date(time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
    }) 

    return ArrivalTime
  }

  return (
    <div className="mx-4 flex flex-wrap justify-center md:p-16 bg-gray-950">
      {listOfBuses.map((bus, index) => (
        <div
          key={index}
          className="w-96 shadow-lg bg-[#060e23] hover:shadow-2xl cursor-pointer mx-4 my-4 p-2 rounded-lg border border-gray-900  transition duration-300 hover:-translate-y-1"
        >
          {/* <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20230717/pngtree-d-rendering-of-a-white-isolated-background-featuring-a-medium-sized-image_3893569.jpg"
            alt="Bus"
            className="rounded-t-md w-full h-48 object-cover"
          /> */}
          <div className="p-4">
            <h1 className="font-semibold text-lg text-white">{bus?.operator || "Luxury Express"}</h1>
            <p className="text-white font-semibold flex border px-2 py-2 rounded-md bg-gray-800 border-transparent shadow my-2 ">
              <span className='mx-1 text-blue-800 '><IoLocationOutline className='my-1 font-bold text-lg'/></span>
              {bus?.routesId?.origin || "Unknown"} {<FaArrowRightLong className='my-1 mx-2'/>} {bus?.routesId?.destination || "Unknown"}
            </p>
            <div className='flex justify-between my-4'>
              <p className='flex flex-col text-white font-bold '> {deptTime(bus?.dep_time)} <span className='text-gray-400 font-normal text-sm'>Departure</span></p>
              <p className='flex flex-col text-white font-bold'> {arriveTime(bus?.arrivalTime)} <span className='text-gray-400 font-normal text-sm'>Arrival</span></p>

            </div>
            <div className="flex flex-wrap my-2">
              {bus.isAc && <p className="border px-2 border-transparent bg-gray-800 text-gray-400 text-sm rounded-full mr-2 my-2">AC</p>}
              {bus.isSleeper && <p className="border px-2 border-transparent bg-gray-800 text-gray-400 text-sm rounded-full mx-2 my-2">Sleeper</p>}
              {bus.isSeater && <p className="border px-2 border-transparent bg-gray-800 text-gray-400 text-sm rounded-full mx-2 my-2">Seater</p>}
              {bus.isWifi && <p className="border px-2 border-transparent bg-gray-800 text-gray-400 text-sm rounded-full mx-2 my-2">WiFi</p>}
            </div>
            
            <div className="flex justify-between items-center mt-4 border-t border-t-gray-700 py-2">
              <p className="text-white font-bold text-2xl flex flex-col">₹{bus?.price || 0} <span className='text-gray-400 font-normal text-sm'>per person</span></p>
              <button
                className="btn-primary hover:cursor-pointer hover:scale-105"
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
