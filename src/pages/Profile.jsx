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

  // Cancellation Modal State
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [selectedSeatsToCancel, setSelectedSeatsToCancel] = useState([]);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('');

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

  const handleOpenCancelModal = (booking) => {
    setCancelModalBooking(booking);
    setSelectedSeatsToCancel([]);
    setCancelError('');
    setCancelSuccessMsg('');
  };

  const handleCloseCancelModal = () => {
    setCancelModalBooking(null);
    setSelectedSeatsToCancel([]);
    setCancelError('');
    setCancelSuccessMsg('');
  };

  const handleToggleSeatCancel = (seatId) => {
    setSelectedSeatsToCancel((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleConfirmCancelSeats = async () => {
    if (!cancelModalBooking || selectedSeatsToCancel.length === 0) return;
    setCancelling(true);
    setCancelError('');
    setCancelSuccessMsg('');

    try {
      const res = await fetch(`${Booking_Base_API}/${cancelModalBooking._id}/cancel-seats`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seatIds: selectedSeatsToCancel }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to cancel seats.');
      }

      setCancelSuccessMsg(
        `Cancelled ${selectedSeatsToCancel.length} seat(s). Refund of ₹${json.refundedAmountInr?.toFixed(
          2
        )} will be credited to your original payment method!`
      );
      // Refresh bookings list
      await fetchBookings();
      setTimeout(() => {
        handleCloseCancelModal();
      }, 2000);
    } catch (err) {
      console.error('Cancellation error:', err);
      setCancelError(err.message || 'Something went wrong while cancelling seats.');
    } finally {
      setCancelling(false);
    }
  };

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

                  const cancelledSeatIdStrings = new Set(
                    (booking.cancelledSeats || []).map((cs) => (cs.seatId?._id || cs.seatId || '').toString())
                  );
                  const activeSeats = (booking.seatIds || []).filter(
                    (ts) => !cancelledSeatIdStrings.has((ts._id || ts).toString())
                  );
                  const isPastDeparture = booking.tripId?.departureDate
                    ? new Date() >= new Date(booking.tripId.departureDate)
                    : false;
                  const canCancel = activeSeats.length > 0 && !isPastDeparture && booking.status !== 'cancelled';

                  const badgeClass =
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'partially_cancelled'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800';

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
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${badgeClass}`}
                          >
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className='text-sm text-gray-700'>
                          {bus.operator || 'Bus'} ({bus.busNumber || 'N/A'}) &bull; {bus.busType || ''}
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          Journey Date: <span className='font-medium text-black'>{journeyDate}</span> &bull; Seats:{' '}
                          <span className='font-semibold text-black'>{seatNumbers || 'N/A'}</span>
                        </p>
                        {booking.cancelledSeats?.length > 0 && (
                          <p className='text-xs text-red-600 mt-1'>
                            Cancelled ({booking.cancelledSeats.length}):{' '}
                            {booking.cancelledSeats.map((cs) => cs.seatNumber).join(', ')}
                          </p>
                        )}
                        <p className='text-xs text-gray-500 mt-1'>
                          Passengers: {booking.passengerDetails?.length || 0} &bull; Order ID:{' '}
                          {booking.razorpayOrderId || 'N/A'}
                        </p>
                      </div>

                      <div className='flex items-center gap-3 shrink-0 flex-wrap'>
                        {canCancel && (
                          <button
                            onClick={() => handleOpenCancelModal(booking)}
                            className='border border-red-600 text-red-600 hover:bg-red-50 font-semibold px-3 py-2 rounded-md cursor-pointer text-sm transition-colors'
                          >
                            Cancel Seats
                          </button>
                        )}

                        <button
                          onClick={() => handleDownloadInvoice(booking._id)}
                          disabled={downloadingId === booking._id}
                          className='bg-[#059468] hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-md cursor-pointer disabled:opacity-50 text-sm'
                        >
                          {downloadingId === booking._id ? 'Generating...' : 'Download Invoice (PDF)'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Seats Modal */}
      {cancelModalBooking && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-black relative animate-in fade-in zoom-in-95 duration-200'>
            <h3 className='text-xl font-bold mb-2'>Cancel Seats & Pro-Rata Refund</h3>
            <p className='text-sm text-gray-600 mb-4'>
              Select the seats you wish to cancel. A pro-rata refund will be instantly credited to your original payment method.
            </p>

            {cancelError && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md'>
                {cancelError}
              </div>
            )}

            {cancelSuccessMsg && (
              <div className='mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md'>
                {cancelSuccessMsg}
              </div>
            )}

            <div className='mb-4'>
              <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>
                Available Seats for Cancellation
              </label>
              <div className='flex flex-col gap-2 max-h-56 overflow-y-auto pr-1'>
                {(() => {
                  const cancelledSet = new Set(
                    (cancelModalBooking.cancelledSeats || []).map((cs) =>
                      (cs.seatId?._id || cs.seatId || '').toString()
                    )
                  );
                  const seatList = cancelModalBooking.seatIds || [];
                  const pricePerSeat = cancelModalBooking.busId?.price || 0;

                  return seatList.map((ts, idx) => {
                    const tsId = (ts._id || ts).toString();
                    const seatNum = ts.seatId?.seatNumber || `Seat ${idx + 1}`;
                    const isCancelled = cancelledSet.has(tsId);
                    const isSelected = selectedSeatsToCancel.includes(tsId);

                    return (
                      <div
                        key={tsId}
                        onClick={() => {
                          if (!isCancelled && !cancelling) handleToggleSeatCancel(tsId);
                        }}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isCancelled
                            ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-red-50 border-red-400 cursor-pointer'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer'
                        }`}
                      >
                        <div className='flex items-center gap-3'>
                          <input
                            type='checkbox'
                            disabled={isCancelled || cancelling}
                            checked={isSelected}
                            onChange={() => {}}
                            className='w-4 h-4 text-red-600 rounded cursor-pointer'
                          />
                          <div>
                            <p className='font-semibold text-sm'>{seatNum}</p>
                            <p className='text-xs text-gray-500'>
                              {ts.seatId?.seatPreference || 'Standard'}
                            </p>
                          </div>
                        </div>

                        <div className='text-right'>
                          {isCancelled ? (
                            <span className='text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded'>
                              Already Cancelled
                            </span>
                          ) : (
                            <span className='text-sm font-semibold text-gray-700'>
                              Refund ~₹{pricePerSeat}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Refund Calculation Preview */}
            <div className='p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6'>
              <div className='flex justify-between text-sm text-gray-600 mb-1'>
                <span>Selected Seats:</span>
                <span className='font-semibold text-black'>{selectedSeatsToCancel.length}</span>
              </div>
              <div className='flex justify-between text-sm text-gray-600 mb-1'>
                <span>Estimated Refund:</span>
                <span className='font-bold text-green-700'>
                  ₹{((cancelModalBooking.busId?.price || 0) * selectedSeatsToCancel.length).toFixed(2)}
                </span>
              </div>
              <p className='text-[11px] text-gray-500 mt-1 border-t border-gray-200 pt-1'>
                * 100% refund calculated pro-rata per seat. Handled securely via Razorpay.
              </p>
            </div>

            <div className='flex justify-end gap-3'>
              <button
                type='button'
                onClick={handleCloseCancelModal}
                disabled={cancelling}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer disabled:opacity-50 text-sm font-medium'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleConfirmCancelSeats}
                disabled={cancelling || selectedSeatsToCancel.length === 0}
                className='px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer disabled:opacity-50 text-sm font-semibold shadow'
              >
                {cancelling ? 'Processing Refund...' : `Confirm Cancellation (${selectedSeatsToCancel.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

      </motion.div>

   
  );
};

export default Profile;
