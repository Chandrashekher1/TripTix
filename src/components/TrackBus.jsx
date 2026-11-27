import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaBus, FaRoute, FaCalendarAlt, FaClock, FaWifi, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";
import { MdAirlineSeatReclineNormal, MdBed } from "react-icons/md";
import { useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { Bus_Track_API } from '../utils/constant';

const TrackBus = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || searchParams.get('bookingId') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackData, setTrackData] = useState(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  useEffect(() => {
    const initialQuery = searchParams.get('q') || searchParams.get('bookingId');
    if (initialQuery) {
      setQuery(initialQuery);
      handleTrack(initialQuery);
    }
  }, [searchParams]);

  const handleTrack = async (searchQuery) => {
    const q = (searchQuery !== undefined ? searchQuery : query).trim();
    if (!q) {
      setError('Please enter a bus number or booking ID');
      return;
    }

    setLoading(true);
    setError('');
    setTrackData(null);

    try {
      const res = await fetch(`${Bus_Track_API}?q=${encodeURIComponent(q)}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'No bus details found for this search.');
      }

      setTrackData(json.data);
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError(err.message || 'Failed to fetch bus information. Please check your query.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
    return timeStr;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className='py-8 border-b border-b-gray-800 bg-[#f5fefa] min-h-screen'>
        <h1 className='text-center font-bold text-3xl md:text-4xl text-black'>Track Bus Info</h1>
        <p className='text-center text-gray-700 my-2'>
          Search by booking ID, ticket order ID, or bus number to view schedule & route details
        </p>

        <div className='md:mx-60 mx-4'>
          <form 
            className='flex flex-col sm:flex-row border border-transparent bg-white py-4 px-4 my-4 rounded-lg shadow-xl w-full gap-3' 
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
          >
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Enter booking ID (e.g. 6b0815...) or Bus Number' 
              className='p-3 rounded-lg border border-gray-200 text-gray-700 focus:outline-[#23a983] w-full text-base'
            />
            <button 
              type="submit"
              disabled={loading}
              className='bg-[#39b290] text-white rounded-lg px-6 py-3 hover:bg-[#23a983] flex items-center justify-center font-semibold cursor-pointer disabled:opacity-50 shrink-0 transition-colors'
            >
              <CiSearch style={{ marginRight: '6px', fontSize: '22px' }} /> 
              {loading ? 'Searching...' : 'Track Bus'}
            </button>
          </form>

          {error && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3 my-4'>
              <FaExclamationCircle className='text-xl shrink-0' />
              <span>{error}</span>
            </div>
          )}

          {trackData && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex flex-col gap-6 my-6'
            >
              {/* Bus Status Card */}
              <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden text-black'>
                <div className='bg-gradient-to-r from-[#059468] to-[#047857] p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                  <div>
                    <span className='text-xs uppercase tracking-widest text-emerald-200 font-bold'>
                      {trackData.type === 'booking' ? 'Booking Verified' : 'Bus Details'}
                    </span>
                    <h2 className='text-2xl font-bold mt-0.5'>{trackData.bus?.operator || 'Operator'}</h2>
                    <p className='text-sm text-emerald-100 font-medium'>
                      Bus No: {trackData.bus?.busNumber} &bull; {trackData.bus?.busType}
                    </p>
                  </div>
                  <div className='bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold'>
                    Status: {trackData.trip?.journeyStatus === 'arrived' ? 'Completed' : trackData.trip?.journeyStatus === 'on_time' ? 'On Schedule' : 'Scheduled'}
                  </div>
                </div>

                {/* Route Header Banner */}
                {trackData.route && (
                  <div className='p-6 border-b border-gray-100 bg-[#f9fafb]'>
                    <div className='flex items-center justify-between flex-wrap gap-4'>
                      <div>
                        <p className='text-xs text-gray-500 uppercase font-semibold'>Origin</p>
                        <h3 className='text-xl font-bold text-gray-900 capitalize'>{trackData.route.origin}</h3>
                        <p className='text-sm font-medium text-emerald-700 mt-1 flex items-center gap-1.5'>
                          <FaClock /> Departure: {formatTime(trackData.bus?.depTime)}
                        </p>
                      </div>

                      <div className='flex flex-col items-center px-4'>
                        <span className='text-xs font-semibold text-gray-500'>{trackData.route.distance} km</span>
                        <div className='flex items-center gap-2 my-1 text-emerald-600'>
                          <div className='w-12 sm:w-24 h-0.5 bg-emerald-300'></div>
                          <FaBus className='text-lg' />
                          <div className='w-12 sm:w-24 h-0.5 bg-emerald-300'></div>
                        </div>
                        <span className='text-[11px] text-gray-400'>Direct Route</span>
                      </div>

                      <div className='text-right'>
                        <p className='text-xs text-gray-500 uppercase font-semibold'>Destination</p>
                        <h3 className='text-xl font-bold text-gray-900 capitalize'>{trackData.route.destination}</h3>
                        <p className='text-sm font-medium text-emerald-700 mt-1 flex items-center justify-end gap-1.5'>
                          <FaClock /> Arrival: {formatTime(trackData.bus?.arrivalTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Journey & Booking Meta Details */}
                <div className='p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                  <div className='flex items-start gap-3'>
                    <span className='p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-lg'>
                      <FaCalendarAlt />
                    </span>
                    <div>
                      <p className='text-xs text-gray-500 font-semibold uppercase'>Journey Date</p>
                      <p className='text-base font-bold text-gray-900'>
                        {formatDate(trackData.trip?.departureDate)}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <span className='p-2.5 rounded-lg bg-blue-50 text-blue-700 text-lg'>
                      <FaRoute />
                    </span>
                    <div>
                      <p className='text-xs text-gray-500 font-semibold uppercase'>Fare per Seat</p>
                      <p className='text-base font-bold text-gray-900'>
                        ₹{trackData.bus?.price}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <span className='p-2.5 rounded-lg bg-purple-50 text-purple-700 text-lg'>
                      <FaBus />
                    </span>
                    <div>
                      <p className='text-xs text-gray-500 font-semibold uppercase'>Total Capacity</p>
                      <p className='text-base font-bold text-gray-900'>
                        {trackData.bus?.totalSeats} Seats
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className='px-6 py-4 border-t border-gray-100 flex items-center gap-4 flex-wrap bg-gray-50/50'>
                  <span className='text-xs font-semibold text-gray-500 uppercase'>Amenities:</span>
                  {trackData.bus?.amenities?.isAc && (
                    <span className='inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full'>
                      <TbAirConditioning /> AC
                    </span>
                  )}
                  {trackData.bus?.amenities?.isSleeper && (
                    <span className='inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full'>
                      <MdBed /> Sleeper
                    </span>
                  )}
                  {trackData.bus?.amenities?.isSeater && (
                    <span className='inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-200 text-gray-800 px-3 py-1 rounded-full'>
                      <MdAirlineSeatReclineNormal /> Seater
                    </span>
                  )}
                  {trackData.bus?.amenities?.isWifi && (
                    <span className='inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full'>
                      <FaWifi /> Wi-Fi
                    </span>
                  )}
                </div>

                {/* Booking Specific Info if searched by booking */}
                {trackData.booking && (
                  <div className='m-6 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200'>
                    <div className='flex items-center justify-between mb-2'>
                      <h4 className='font-bold text-emerald-900 flex items-center gap-2'>
                        <FaCheckCircle className='text-emerald-600' /> Your Ticket Information
                      </h4>
                      <span className='text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800'>
                        {trackData.booking.status}
                      </span>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm'>
                      <div>
                        <span className='text-gray-500 text-xs block'>Booked Seats:</span>
                        <span className='font-bold text-gray-900'>{trackData.booking.seats?.join(', ') || 'N/A'}</span>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs block'>Passengers:</span>
                        <span className='font-bold text-gray-900'>{trackData.booking.passengerCount}</span>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs block'>Booking ID:</span>
                        <span className='font-mono font-medium text-gray-700 text-xs'>{trackData.booking.bookingId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TrackBus;