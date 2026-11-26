import React, { useContext, useEffect, useState } from 'react';
import { LuUser } from "react-icons/lu";
import { Booking_Base_API, My_Bookings_API, Profile_API } from '../utils/constant';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const Profile = () => {
  const [isProfile, setIsProfile] = useState(false);
  const [data, setData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const id = localStorage.getItem('userId');
  const { logout ,token } = useContext(AuthContext);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  
  useEffect(() => {
    if (!token) return;
    fetchUser();
    fetchBookings();
  }, [token])

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch(My_Bookings_API, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
      });
      const json = await res.json();
      if (json.success) {
        setBookings(json.data || []);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err.message);
    } finally {
      setLoadingBookings(false);
    }
  }

  const handleDownloadInvoice = async (bookingId) => {
    setDownloadingId(bookingId);
    try {
      const res = await fetch(`${Booking_Base_API}/${bookingId}/invoice`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to download invoice');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TripTix-INV-${bookingId.slice(-8).toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading invoice:", err.message);
      alert("Could not download invoice. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  }

  const fetchUser = async () => {
    try {
      const res = await fetch(`${Profile_API}/me`, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
      });
      const json = await res.json();
      setData(json.data);
      setEditName(json.data.name);
      setEditEmail(json.data.email);
      setEditPhone(json.data.phone);
      setEditMode(false);
    } catch (err) {
      console.log("Error:", err.message);
    }
  }

  const updateUser = async () => {
    try {
      const res = await fetch(`${Profile_API}/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editName, email: editEmail, phone: editPhone })
      });
      const json = await res.json();
      setData(json.data);
      setEditMode(false);
    } catch (err) {
      console.error("Error:", err.message);
    }
  }

  const handleLogout = () => {
    navigate('/');
    logout();
    
  }

  if(!token) {
    navigate('/')
  }

  return (
    <motion.div 
        variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
      >
         <div className='py-2 border-b border-b-gray-700 bg-[#f5fefa]'>
      <div className='flex items-center justify-center flex-col py-8'>
        <span className='rounded-full p-4 bg-gradient-to-r from-blue-500 to-teal-500'>
          <LuUser style={{ fontSize: '40px' }} />
        </span>
        <h1 className='font-bold text-3xl my-4 text-black'>{data.name}</h1>
        <p className='flex text-gray-700'>{data.email} <span className='mx-4'><li>{data.phone}</li></span></p>
      </div>

      <div className='flex mx-4 my-4 text-gray-700 border border-transparent bg-white shadow-lg py-1 rounded-md justify-around md:mx-60'>
        <button
          className={`cursor-pointer w-full py-2 rounded-md mx-1 font-semibold ${isProfile ? 'bg-green-200 text-black' : 'bg-transparent'}`}
          onClick={() => setIsProfile(true)}
        >
          My Bookings
        </button>
        <button
          className={`cursor-pointer w-full py-2 rounded-md mx-1 font-semibold ${!isProfile ? 'bg-green-200 text-black' : 'bg-transparent'}`}
          onClick={() => setIsProfile(false)}
        >
          Profile Settings
        </button>
      </div>

      <div className='mx-4 my-4 md:my-8 md:mx-60'>
        {!isProfile && (
          <div className='text-black bg-white border border-transparent shadow-lg px-4 rounded-lg'>
            <h1 className='font-semibold text-2xl my-4'>Personal Information</h1>
            <div className='my-4'>
              <label className='text-gray-700 font-semibold'>Full Name</label>
              {editMode ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className='border w-full px-2 py-1 rounded-md my-2 text-black'
                />
              ) : <p className='text-black font-bold text-lg'>{data?.name}</p>}

              <label className='text-gray-700 font-semibold mt-4'>Email</label>
              {editMode ? (
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className='border w-full px-2 py-1 rounded-md my-2 text-black'
                />
              ) : <p className='text-black font-bold text-lg'>{data?.email}</p>}

              <label className='font-semibold text-gray-700'>Phone</label>
              {editMode ? (
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className='border w-full px-2 py-1 rounded-md my-2 text-black'
                />
              ) : <p className='text-black font-bold text-lg'>{data?.phone}</p>}
            </div>

            <div className='flex justify-between items-center'>
              {editMode ? (
                <button
                  className='bg-green-700 shadow-md text-white font-semibold px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer my-8'
                  onClick={updateUser}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  className='bg-gray-400 shadow-md text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer my-8'
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              )}

              <button
                className=' bg-red-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-500 cursor-pointer'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {isProfile && (
          <div className='bg-white text-black px-4 md:px-6 border border-transparent py-6 rounded-lg my-8 shadow-lg'>
            <h2 className='font-semibold text-2xl mb-4'>My Bookings</h2>
            {loadingBookings ? (
              <p className='text-gray-600'>Loading your bookings...</p>
            ) : bookings.length === 0 ? (
              <p className='font-semibold text-xl text-gray-700'>No Booking Details found.</p>
            ) : (
              <div className='flex flex-col gap-4'>
                {bookings.map((booking) => {
                  const bus = booking.busId || {};
                  const route = bus.routesId || {};
                  const seatNumbers = (booking.seatIds || [])
                    .map((ts, idx) => ts?.seatId?.seatNumber || `Seat ${idx + 1}`)
                    .join(', ');
                  const journeyDate = booking.tripId?.departureDate
                    ? new Date(booking.tripId.departureDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <div
                      key={booking._id}
                      className='border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition-shadow'
                    >
                      <div>
                        <div className='flex items-center gap-3 mb-1'>
                          <h3 className='font-bold text-lg capitalize'>
                            {route.origin || 'Origin'} &rarr; {route.destination || 'Destination'}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <p className='text-sm text-gray-700'>
                          {bus.operator || 'Bus'} ({bus.busNumber || 'N/A'}) &bull; {bus.busType || ''}
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          Journey Date: <span className='font-medium text-black'>{journeyDate}</span> &bull; Seats:{' '}
                          <span className='font-semibold text-black'>{seatNumbers || 'N/A'}</span>
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          Passengers: {booking.passengerDetails?.length || 0} &bull; Order ID:{' '}
                          {booking.razorpayOrderId || 'N/A'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDownloadInvoice(booking._id)}
                        disabled={downloadingId === booking._id}
                        className='bg-[#059468] hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-md cursor-pointer disabled:opacity-50 shrink-0'
                      >
                        {downloadingId === booking._id ? 'Generating...' : 'Download Invoice (PDF)'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>

      </motion.div>

   
  );
};

export default Profile;
