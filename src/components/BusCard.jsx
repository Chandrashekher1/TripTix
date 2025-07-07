import React, { useEffect, useState } from 'react';
import useBus from '../hook/useBus';
import { useNavigate } from 'react-router-dom';

const BusCard = () => {
  const [listOfBuses, setListOfBuses] = useState([]);
  const searchData = useBus()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/bus/topRated')
        const json = await response.json()
        console.log(json)
        setListOfBuses(json || [])
      } catch (err) {
        console.log("Error:", err.message)
      }
    };
    fetchBus();
  }, [])

  const handleBookNow = (bus) => {
    console.log(bus);
    
    const route = {
        origin: bus.routesId?.origin,
        destination: bus.routesId?.destination,
        // date: new Date(bus.dep_time)
    }
    console.log(route);
    
    searchData.setRouteDetails(route);
    navigate('/available-seat')
  }

  return (
    <div className='mx-4 flex flex-wrap justify-center'>
      {listOfBuses.map((bus, index) => (
        <div
          key={index}
          className='w-80 shadow bg-white hover:shadow-2xl cursor-pointer mx-4 my-4 rounded-md border border-gray-200 transition duration-300'
        >
          <img
            src="https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/17256/5/FR/ML/reRz0p.jpeg"
            alt="Bus"
            className='rounded-t-md w-full h-48 object-cover'
          />
          <div className='p-4'>
            <h1 className='font-semibold text-lg'>{bus.operator || "Luxury Express"}</h1>
            <p className='text-blue-700 font-semibold'>{bus.routesId?.origin} {'->'} {bus.routesId?.destination}</p>
            <div className='flex flex-wrap'>
                <p className='border px-4 bg-gray-200 border-transparent rounded-full text-sm font-semibold mx-2 my-2'>{bus.isAc? 'AC' : null}</p>
                <p className='border px-4 bg-gray-200 border-transparent rounded-full text-sm font-semibold mx-2 my-2'>{bus.isSleeper? 'Sleeper' : null}</p>
                <p className='border px-4 bg-gray-200 border-transparent rounded-full text-sm font-semibold mx-2 my-2'>{bus.isSeater? 'Seater' : null}</p>  
                <p className='border px-4 bg-gray-200 border-transparent rounded-full text-sm font-semibold mx-2 my-2'>{bus.isWifi? 'Wifi' : null}</p>
            </div>
            <div className='flex justify-between items-center my-4'>
              <p className='text-green-900 font-bold text-xl'>₹{bus.price}</p>
              <button className='btn-primary hover:cursor-pointer hover:scale-105' onClick={() => handleBookNow(bus)}>Book Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusCard;
