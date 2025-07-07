import React, { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';
import useBus from '../hook/useBus';
import { token } from '../utils/constant';

const SeatSelection = () => {
  const  busId = useParams()
  const navigate = useNavigate()
  const searchData = useBus()
  const [selectedSeats, setSelectedSeats] = useState([])
  
  if (!searchData?.buses || searchData.buses.length === 0) {
    return <p className='boder mx-4 border-transparent shadow-xl text-gray-700 font-semibold bg-white p-8 '>Loading....</p>;
  }
  const selectedBus = searchData.buses.find((bus) => String(bus._id) === String(busId.id))|| []  // {/*not use bus._id -> because it is undefined during find method*/}
  console.log(selectedBus);
  
  const seats = Array.from({ length: selectedBus?.totalSeat || 0 }, (_, index) => index + 1)
  
  const handleSeatClick = async (seatNum) => {
    const isSelected = selectedSeats.includes(seatNum);
    const updatedSeats = isSelected
      ? selectedSeats.filter((s) => s !== seatNum)
      : [...selectedSeats, seatNum];

    setSelectedSeats(updatedSeats);

    if (!isSelected) {
      try {
        const response = await fetch('http://localhost:3000/api/v1/seat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, 
          },
          body: JSON.stringify({
            busId: busId.id,                     
            seatIds: [seatNum]    
          }),
        });

        const data = await response.json();
        console.log("Response data:", data);
        if (!response.ok) {
          alert(data.message || "Failed to lock seat");
          setSelectedSeats(selectedSeats)
        } else {
          console.log("Seat locked:", data)
        }
      } catch (err) {
        console.error(" Error:", err.message)
      }
    }
  }


  return (
    <div className='home px-4 py-12'>
      <div className='flex justify-between'>
        <p className='flex font-semibold cursor-pointer' onClick={() => navigate('/available-seat')}>
          <IoIosArrowRoundBack style={{ marginRight: '8px', fontSize: '30px' }} /> Back to Buses
        </p>
        <h1 className='flex flex-col font-bold text-2xl'>
          {selectedBus?.operator || "Bus"} <span className='text-lg font-medium text-gray-700'>{selectedBus?.busType}</span>
        </h1>
      </div>

      <div className='bg-white p-8 rounded-md shadow-lg my-8'>
        <h1 className='text-center text-xl font-semibold'>Select Your Seats</h1>
        <div className='flex my-2 gap-4'>
          <p><span className='inline-block w-4 h-4 bg-green-500 rounded mx-1'></span>Available</p>
          <p><span className='inline-block w-4 h-4 bg-blue-500 rounded mx-1'></span>Selected</p>
          <p><span className='inline-block w-4 h-4 bg-gray-500 rounded mx-1'></span>Booked</p>
        </div>

        <div className='flex flex-col items-center my-4 p-4 bg-gray-100 rounded-md'>
          <FiUser />
          <span className='text-gray-600'>Driver</span>
        </div>

        <div className='grid grid-cols-4 gap-4 my-4'>
          {seats.map((seatNum) => (
            <div
              key={seatNum}
              className={`p-2 rounded-md text-center cursor-pointer font-semibold 
                ${selectedSeats.includes(seatNum) ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'}`}
              onClick={() => handleSeatClick(seatNum)}
            >
              {seatNum}
            </div>
          ))}
        </div>
      </div>

      <div className='rounded-md bg-white shadow-xl p-4'>
        <h1 className='font-semibold text-xl'>Booking Summary</h1>
        <div className='my-4'>
          <p className='font-semibold'>Selected Seats</p>
          <div className='flex flex-wrap gap-2'>
            {selectedSeats.map((seat) => (
              <span key={seat} className='bg-gray-100 px-3 py-1 rounded-2xl font-semibold'>{`Seat ${seat}`}</span>
            ))}
          </div>
        </div>
        <div className='border-b border-gray-200 my-2'></div>
        <div>
          <p className='flex justify-between'>Seats ({selectedSeats.length}) <span>₹{selectedSeats.length * selectedBus?.price || 0}</span></p>
          <p className='flex justify-between font-semibold'>Total <span className='text-blue-600'>₹{selectedSeats.length * selectedBus?.price || 0}</span></p>
        </div>
        <button className='btn-primary w-full my-4' onClick={() => navigate('/passenger-details')}>Proceed to Book</button>
      </div>
    </div>
  );
};

export default SeatSelection;
