import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { FiUser } from 'react-icons/fi';
import {Bus_API, Seat_API, Trip_API, Socket_URL } from '../utils/constant';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import { MdEventSeat } from "react-icons/md";
import {motion} from "framer-motion"

const SeatSelection = () => {
  const { id: busId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [message, setMessage] = useState('');
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState('');
  const socketRef = useRef(null);
  const {token} = useContext(AuthContext)

  useEffect(() => {
    fetchBusDetails();
    fetchTrips();
  }, [busId]);

  useEffect(() => {
    if (!tripId) return;
    setSelectedSeats([]);
    fetchSeats();

    if (!token) return;

    const socket = io(Socket_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinTrip', { tripId });
    });

    socket.on('connect_error', (err) => {
      setMessage(err.message === 'Invalid token' ? 'Your session has expired. Please log in again.' : 'Live seat updates are unavailable.');
    });

    socket.on('seatsUpdated', ({ tripId: updatedTripId, seatIds, status, userId }) => {
      if (updatedTripId !== tripId) return;
      setSeats(prev =>
        prev.map(seat => seatIds.includes(seat._id) ? { ...seat, status, userId } : seat))
      if (status !== 'available') {
        setSelectedSeats(prev => prev.filter(id => !seatIds.includes(id)));
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [tripId, token]);

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${Trip_API}?busId=${busId}`);
      const json = await res.json();
      const list = json.data || [];
      setTrips(list);
      if (list.length === 0) {
        setSeats([]);
        setTripId('');
        setMessage('No trips are scheduled for this bus.');
        return;
      }
      const upcoming = list.find(t => new Date(t.departureDate) >= new Date());
      setTripId((upcoming || list[0])._id);
    } catch (err) {
      console.error('Error :', err.message);
    }
  };

  const fetchSeats = async () => {
    try {
      const res = await fetch(`${Seat_API}/trip/${tripId}`);
      const json = await res.json();
      if (json.success) {
        setSeats(json.data);
        setMessage('');
      } else {
        setSeats([]);
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
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    const socket = socketRef.current;
    if (!token || !socket) {
      setMessage('Please log in to book seats.');
      return;
    }
    socket.timeout(5000).emit('lockSeats', { tripId, seatIds: selectedSeats }, (err, response) => {
      if (err) {
        setMessage('The server did not respond. Please try again.');
        return;
      }
      if (!response.success) {
        setMessage(response.message || 'Could not reserve the selected seats.');
        setSelectedSeats([]);
        fetchSeats();
        return;
      }
      navigate('/passenger-details', { state: { busId, tripId, selectedSeats } });
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (

    <motion.div
          variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
    >
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

          {trips.length > 0 && (
            <div className='flex justify-center mb-4'>
              <select
                value={tripId}
                onChange={(e) => setTripId(e.target.value)}
                className='border border-gray-400 rounded-md px-3 py-2 text-black'
              >
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {new Date(trip.departureDate).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
          )}

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

    </motion.div>
  );
};

export default SeatSelection;
