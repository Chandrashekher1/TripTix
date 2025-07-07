import React, { useEffect, useState } from 'react';
import { Bus_API } from '../utils/constant';
import useBus from '../hook/useBus';
import { FaStar } from "react-icons/fa";
import { TbUsers } from "react-icons/tb";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const AvailableBus = () => {
  const  searchData  = useBus();
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate()

  const handleSeat = (id) => {
    navigate(`/seat-selection/${id}`)
  }
  
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await fetch(
          `${Bus_API}origin=${searchData.routeDetails.origin}&destination=${searchData.routeDetails.destination}`
        );
        const json = await res.json();
        setBuses(json);
      } catch (err) {
        console.error("Error fetching bus:", err.message);
      }
    };

    if(searchData?.routeDetails.origin && searchData?.routeDetails.destination){
      fetchBus()
    }
    else{
      navigate('/')
    }

  }, [searchData]);

  return (
    <div className="home py-8">
      <h1 className="font-bold text-3xl text-center my-4">Available Buses</h1>
      <div className='my-4'>
        <p className='flex justify-center text-gray-700'>{searchData?.routeDetails.origin} <IoIosArrowRoundForward style={{fontSize:'30px'}}/> {searchData?.routeDetails.destination} <li className='mx-4'>{searchData?.routeDetails.date}</li></p>
      </div>
      {buses.length === 0 ? (
        <p className="text-gray-700 font-semibold text-center bg-white shadow mx-4 py-8">No buses available for this route.</p>
      ) : (
        buses.map((bus, index) => (
          <div key={index} className="border px-4 mx-4 my-4 py-4 bg-white shadow-xl border-transparent rounded-md">
            <h1 className="font-bold text-xl flex justify-between">{bus.operator} <span className='font-bold flex text-sm'><FaStar style={{color: 'yellow' , fontSize:'20px'}}/>4.5</span></h1>
            <p className="text-gray-700">{bus.isAc ? "AC" : null} {bus.isSleeper ? "Sleeper": null}</p>

           <div className='flex justify-between my-4 mx-8'>
               <p className="font-semibold">{new Date(bus.dep_time).toLocaleString()}</p>
              <div className='border-b text-gray-700 mx-4'>8h 30min</div>
              <p className="font-semibold">{new Date(bus.arrivalTime).toLocaleString()}</p>
           </div>
            <p className="text-gray-700 font-semibold">Bus No: {bus.busNumber}</p>
            <p className="text-green-700 font-semibold my-4 flex justify-center text-xl"><TbUsers style={{marginTop:'4px', marginRight:'4px'}}/> <span className='font-bold mx-1'>{bus.totalSeat}</span> Seats available</p>

            <div className='flex flex-col justify-center items-center'>
              <p className='text-gray-700 font-semibold'>Starting from</p>
              <p className='text-xl font-bold'>₹ {bus.price}</p>
            </div>
            
            <button className='btn-primary w-full my-4 mx-2 cursor-pointer' onClick={() => handleSeat(bus._id)}>Select Seats</button>
            
          </div>
        ))
      )}
    </div>
  );
};

export default AvailableBus;
