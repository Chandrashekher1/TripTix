import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { LuUser } from "react-icons/lu";
import { useLocation, useNavigate } from 'react-router-dom';
import { Bus_API } from '../utils/constant';

const PassengerDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [BusDetails, setBusDetails] = useState({});

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const fetchBus = await fetch(`${Bus_API}/${state.busId}`);
        const json = await fetchBus.json();
        setBusDetails(json);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchBusDetails();
  }, []);

  const departureTime = new Date(BusDetails.dep_time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  const arrivalTime = new Date(BusDetails.arrivalTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

    const durationInMs = arrivalTime - departureTime
    const hours = Math.floor(durationInMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));

    console.log(`${hours}h ${minutes}m`);
  
  return (
    <div className='home py-8 px-4'>
      <div className='flex justify-between md:justify-normal md:mx-40'>
        <p className='flex font-semibold cursor-pointer' onClick={() => navigate('/available-seat')}>
          <IoIosArrowRoundBack style={{ marginRight: '8px', fontSize: '30px' }} /> Back to Buses
        </p>
        <h1 className='flex flex-col font-bold text-2xl md:mx-16'>
          Passenger Details <span className='text-lg font-medium text-gray-700'>Fill details for all passengers</span>
        </h1>
      </div>

      <div className='md:mx-40 md:flex md:gap-8'>
        <div className='flex flex-col gap-6 md:w-2/3'>
          {state?.selectedSeats?.map((seat, index) => (
            <form key={seat} className='bg-white py-8 border border-transparent shadow rounded-md px-4 md:px-8'>
              <div className='my-4'>
                <p className='font-semibold flex items-center'>
                  <LuUser className='text-blue-600 text-xl mr-2' />
                  Passenger {index + 1} 
                </p>
              </div>
              <label className='font-semibold my-2'>Full Name</label>
              <input type="text" required placeholder='Enter full name' className='px-4 py-2 rounded-md border border-blue-100 w-full' />
              <label className='font-semibold my-2'>Age</label>
              <input type="number" required placeholder='Age' className='px-4 py-2 rounded-md border border-blue-100 w-full' />
              <label className='font-semibold my-2'>Phone Number</label>
              <input type="number" required placeholder='Phone Number' className='px-4 py-2 rounded-md border border-blue-100 w-full' />
              <label className='font-semibold my-2'>Email Address</label>
              <input type="email" required placeholder='Email Address' className='px-4 py-2 rounded-md border border-blue-100 w-full' />
              <label className='font-semibold my-2'>Gender</label>
              <input type="text" placeholder='Gender' className='px-4 py-2 rounded-md border border-blue-100 w-full' />
            </form>
          ))}
        </div>

        <div className='bg-white rounded-md p-6 shadow mt-8 md:mt-0 md:w-1/3 h-fit sticky top-24'>
          <h1 className='font-semibold text-2xl mb-4'>Booking Summary</h1>
          <p className='text-lg font-semibold'>{`${BusDetails.operator || ''} - ${BusDetails.busType || ''}`}</p>

          <p className='flex justify-between mt-2'>Departure <span className='font-bold'>{departureTime}</span></p>
          <p className='flex justify-between'>Arrival <span className='font-bold'>{arrivalTime}</span></p>
          <p className='flex justify-between'>Duration <span className='font-bold'>8h 30m</span></p>

          <div className='border-b my-4 border-gray-200'></div>
          {/* <div>
            <p className='font-semibold text-gray-700'>Selected Seats</p>
            <div className='flex flex-wrap gap-2 mt-2'>
              {state?.selectedSeats?.map(seat => (
                <span key={seat} className='rounded-full bg-blue-50 text-gray-700 px-3 py-1'>{seat}</span>
              ))}
            </div>
          </div> */}
          <div className='border-b border-gray-300 my-4'></div>
          <div>
            <p className='flex justify-between my-2'>Base Fare ({state.selectedSeats.length}) <span>₹{BusDetails.price * state.selectedSeats.length}</span></p>
            <p className='flex justify-between my-2 font-bold text-xl'>Total <span className='text-blue-700'>₹{BusDetails.price * state.selectedSeats.length}</span></p>
          </div>

          <button className='btn-primary w-full mt-4 cursor-pointer' >Proceed to Payment</button>
        </div>
      </div>
    </div>
  );
}

export default PassengerDetails;
