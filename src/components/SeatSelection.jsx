import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FiUser } from 'react-icons/fi';
import {Bus_API, Seat_API } from '../utils/constant';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import { MdEventSeat } from "react-icons/md";

const SeatSelection = () => {
  const { id: busId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [message, setMessage] = useState('');
  const socket = io("https://triptix-backend-4ryx.onrender.com/")
  const {token} = useContext(AuthContext)

  if(!token){
    alert("Please login to book seats");
    navigate('/login')
  }

  useEffect(() => {
    fetchSeats();
    fetchBusDetails();

    socket.on('seatsUpdated', ({seatIds,status,userId}) => {
      setSeats(prev => 
        prev.map(seat => seatIds.includes(seat._id) ? {...seat, status, userId } : seat))
    })

    return () => {
      socket.off('seatsUpdated')
    }

  }, [busId]);

  const fetchSeats = async () => {
    try {
      const res = await fetch(`${Seat_API}/${busId}`, {
        headers: { Authorization: token }
      });
      const json = await res.json();
      if (json.success) {
        setSeats(json.data);
      } else {
        setMessage(json.message || 'Failed to fetch');
      }
    } catch (err) {
      console.error('Error :', err.message);
    }
  };

  const fetchBusDetails = async () => {
    try {
      const res = await fetch(`${Bus_API}/${busId}`);
      const json = await res.json();
      setSelectedBus(json);
    } catch (err) {
      console.error('Error :', err.message);
    }
  }

  const toggleSeatSelection = (seatId, status) => {
    if (status !== 'available') return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleBooking = () => {
    const userId = localStorage.getItem('user') 
    socket.emit('lockSeats',{busId, seatIds: selectedSeats, userId: userId})
    navigate('/passenger-details', { state: { busId, selectedSeats } })
  }
  return (
    <div className='px-6 md:px-12 md:py-12 bg-[#f5fefa]'>
      <div className='flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4 md:px-24'>
        <p className='flex items-center text-black font-medium cursor-pointer hover:border rounded-lg border-transparent px-4 py-2 hover:bg-green-200' onClick={() => navigate('/available-seat')}>
          <IoIosArrowRoundBack className='text-2xl md:mr-2' /> Back to Buses
        </p>
        <div>
          <h1 className='font-bold text-2xl md:text-3xl text-black'>{selectedBus?.operator || "Bus"}</h1>
          <span className='text-gray-700 text-base md:text-lg'>
            {selectedBus?.isAc ? 'AC' : ''} {selectedBus?.isSleeper ? 'Sleeper' : ''}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='bg-white p-6 md:p-8 rounded-lg shadow-xl col-span-2'>
          <h1 className='text-center text-xl md:text-3xl font-bold mb-4 text-black'>Select Your Seats</h1>

          <div className='flex gap-6 justify-center mb-6 text-sm md:text-base'>
            <p className='text-black'><span className='inline-block w-4 h-4 border rounded mr-2'></span>Available</p>
            <p className='text-black'><span className='inline-block w-4 h-4 bg-green-100 border border-green-500 rounded mr-2'></span>Selected</p>
            <p className='text-black'><span className='inline-block w-4 h-4 bg-gray-500 rounded mr-2'></span>Booked</p>
          </div>

          <div className='flex flex-col items-center mb-6 p-4 bg-gray-100 rounded-md'>
            <FiUser className='text-lg mb-1' />
            <span className='text-gray-600 text-sm'>Driver</span>
          </div>

          <div className='flex flex-wrap justify-center'>
            {seats.map((seat) => {
              const isSelected = selectedSeats.includes(seat._id)
              let seatColor = 'bg-white border border-gray-400'

              if (isSelected) seatColor = 'bg-green-100 border border-green-400'
              else if (seat.status !== 'available') seatColor = 'bg-gray-200'

              return (
                <div
                  key={seat._id}
                  className={`rounded-md cursor-pointer text-black w-20 mx-4 my-2 font-semibold flex justify-center ${seatColor}`}
                  onClick={() => toggleSeatSelection(seat._id, seat.status)}
                >
                  <img src="https://img.icons8.com/?size=100&id=PoXXDSy7CGXw&format=png&color=000000" alt="seat" className='w-10 h-10' /> {seat.seatNumber}
                </div>
              );
            })}
          </div>

          {message && (
            <p className='text-red-600 text-center mt-4 text-sm'>{message}</p>
          )}
        </div>

        <div className='bg-white  p-6 md:p-8 rounded-lg shadow-xl h-fit'>
          <h2 className='font-semibold text-xl md:text-2xl mb-4'>Booking Summary</h2>

          <div className='mb-4'>
            <p className='font-semibold mb-2 '>Selected Seats</p>
            <div className='flex flex-wrap gap-2'>
              {selectedSeats.length > 0 ? (
                selectedSeats.map((seat) => (

                  <span key={seat} className='bg-green-100 px-3 py-1 rounded-2xl font-semibold text-sm'>
                    {`Seat ${seats.find(s => s._id === seat)?.seatNumber || seat}`}
                  </span>
                ))
              ) : (
                <p className='text-gray-700 text-sm'>No seats selected</p>
              )}
            </div>
          </div>

          <div className='border-t border-gray-200 pt-4 mt-4'>
            <div className='flex justify-between text-sm mb-2'>
              <p>Seats ({selectedSeats.length})</p>
              <p>₹{selectedSeats.length * (selectedBus?.price || 0)}</p>
            </div>
            <div className='flex justify-between font-bold text-base'>
              <p>Total</p>
              <p className='text-green-700'>₹{selectedSeats.length * (selectedBus?.price || 0)}</p>
            </div>
            <button
              className='bg-[#059468] hover:bg-green-800 w-full mt-6 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-700'
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 }
            >
              Proceed to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
