import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { LuUser } from "react-icons/lu";
import { useLocation, useNavigate } from 'react-router-dom';
import { Booking_API, Bus_API, Razorpay_API, token } from '../utils/constant';
import { io } from 'socket.io-client';

const PassengerDetails = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [BusDetails, setBusDetails] = useState({})
  const [passengerDetails, setPassengerDetails] = useState(
      state.selectedSeats.map((seatId) => ({
        seatId,
        name: '',
        age: '',
        gender: ''
      }))
  )
  const socket = io("https://triptix-backend-4ryx.onrender.com/")


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

  const handleBooking = async () => {
    const userId = localStorage.getItem("user");

    try {
      const res = await fetch(Booking_API, {
        method: 'POST',
        headers: {
          'authorization':token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          busId: state.busId,
          seatIds: state.selectedSeats,
          passengerDetails
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("Booking successful!");
        navigate('/profile');
      } 

    } catch (err) {
      console.error(err.message);
      alert("Something went wrong. Please try again.");
    }
  }

  const handlePayment = async() => {
      const res = await fetch(Razorpay_API, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({amount: BusDetails.price * state.selectedSeats.length})
      })
      const data = await res.json()
      console.log(data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: data.amount,
        currency: data.currency,
        name: 'TripTix Booking',
        description: 'Bus Ticket Booking',
        order_id: data.id,
        handler: function(response) {
          alert('Payment successful!');
          console.log(response);
          if(response.razorpay_payment_id) {
            handleBooking()
          }
      },
      modal: {
        ondismiss: () => {
          alert('Payment cancelled');
          socket.emit('unlockSeats', {seatIds: state.selectedSeats})
        }
      },
      theme: {
          color: '#3399cc'}
    }
      const rzp = new window.Razorpay(options)
      rzp.open();
  }
  const departureTime = new Date(BusDetails.dep_time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  const arrivalTime = new Date(BusDetails.arrivalTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  const getDuration = (depTime, arrTime) => {
    const dep = new Date(depTime);
    let arr = new Date(arrTime);

    if (isNaN(dep) || isNaN(arr)) return '--';

    // for overnight buses
    if (arr < dep) arr.setDate(arr.getDate() + 1);

    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }
  
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
          <form key={seat} className="bg-white py-8 shadow rounded-md px-4 md:px-8">
            <div className="my-4">
              <p className="font-semibold flex items-center">
                <LuUser className="text-blue-600 text-xl mr-2" />
                Passenger {index + 1} 
              </p>
            </div>
            <label className="font-semibold my-2">Full Name</label>
            <input
              type="text"
              required
              placeholder="Enter full name"
              value={passengerDetails[index].name}
              onChange={(e) => {
                const updated = [...passengerDetails];
                updated[index].name = e.target.value;
                setPassengerDetails(updated);
              }}
              className="px-4 py-2 rounded-md border border-blue-100 w-full"
            />

            <label className="font-semibold my-2">Age</label>
            <input
              type="number"
              required
              placeholder="Age"
              value={passengerDetails[index].age}
              onChange={(e) => {
                const updated = [...passengerDetails];
                updated[index].age = e.target.value;
                setPassengerDetails(updated);
              }}
              className="px-4 py-2 rounded-md border border-blue-100 w-full"
            />

            <label className="font-semibold my-2">Gender</label>
            <input
              type="text"
              required
              placeholder="Gender"
              value={passengerDetails[index].gender}
              onChange={(e) => {
                const updated = [...passengerDetails];
                updated[index].gender = e.target.value;
                setPassengerDetails(updated);
              }}
              className="px-4 py-2 rounded-md border border-blue-100 w-full"
            />
          </form>
        ))}

        </div>

        <div className='bg-white rounded-md p-6 shadow mt-8 md:mt-0 md:w-1/3 h-fit sticky top-24'>
          <h1 className='font-semibold text-2xl mb-4'>Booking Summary</h1>
          <p className='text-lg font-semibold'>{`${BusDetails.operator || ''} - ${BusDetails.busType || ''}`}</p>

          <p className='flex justify-between mt-2'>Departure <span className='font-bold'>{departureTime}</span></p>
          <p className='flex justify-between'>Arrival <span className='font-bold'>{arrivalTime}</span></p>
          <p className='flex justify-between'>Duration <span className='font-bold'>{getDuration(departureTime,arrivalTime)}</span></p>

          <div className='border-b my-4 border-gray-200'></div>
          <div className='border-b border-gray-300 my-4'></div>
          <div>
            <p className='flex justify-between my-2'>Base Fare ({state.selectedSeats.length}) <span>₹{BusDetails.price * state.selectedSeats.length}</span></p>
            <p className='flex justify-between my-2 font-bold text-xl'>Total <span className='text-blue-700'>₹{BusDetails.price * state.selectedSeats.length}</span></p>
          </div>

          <button className='btn-primary w-full mt-4 cursor-pointer'  onClick={handlePayment}>Proceed to Payment</button>
        </div>
      </div>
    </div>
  );
}

export default PassengerDetails;
