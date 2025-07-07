import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { LuUser } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';


const PassengerDetails = () => {
    const navigate = useNavigate();
  return (
    <div className='home py-8 px-4'>
         <div className='flex justify-between'>
            <p className='flex font-semibold' onClick={() => navigate('/available-seat')}>{<IoIosArrowRoundBack style={{marginRight:'8px', fontSize:'30px'}}/>} Back to Buses</p>
            <h1 className='flex flex-col font-bold text-2xl'>Passenger Details <span className='text-lg font-medium text-gray-700'>Fill details for all passenger</span></h1>
        </div>

        <form action="" className='bg-white py-8 border border-transparent shadow rounded-md my-8 px-4 flex flex-col'>
            <div className='my-4'>
                <p className='font-semibold flex'>{<LuUser style={{marginTop:'4', marginLeft:'4', marginRight:'8px', color:'blue', fontSize:'20px'}}/>} Passanger 1 - Seat 39</p>
            </div>
            <label htmlFor="" className='font-semibold my-2'>Full Name</label>
            <input type="text" placeholder='Enter full name' className='px-4 py-2 rounded-md border border-blue-100' />
            <label htmlFor="" className='font-semibold my-2'>Age</label>
            <input type="text" placeholder='Age' className='px-4 py-2 rounded-md border border-blue-100' />
            <label htmlFor="" className='font-semibold my-2'>Phone Number</label>
            <input type="Number" placeholder='Phone Number' className='px-4 py-2 rounded-md border border-blue-100' />
            <label htmlFor="" className='font-semibold my-2'>Email Address</label>
            <input type="email" placeholder='Email Address' className='px-4 py-2 rounded-md border border-blue-100' />
            <label htmlFor="" className='font-semibold my-2'>Gender</label>
            <input type="text" placeholder='Gender' className='px-4 py-2 rounded-md border border-blue-100' />
        </form>

        <div className='bg-white rounded-md p-4 shadow'>
            <h1 className='font-semibold text-2xl my-4'>Booking Summary</h1>
            <p className='text-lg font-semibold'>{`Royal Coach - Volvo AC`}</p>

            <p className='flex justify-between'>Departure <span className='font-bold'>9:15 PM</span></p>
            <p className='flex justify-between'>Arrival <span className='font-bold'>5:15 AM</span></p>
            <p className='flex justify-between'>Duration <span className='font-bold'>8h 30m</span></p>

            <div className='border-b my-4 border-gray-200'></div>
            <div>
                <p className='font-semibold text-gray-700'>Selected Seats</p>
                <p className='rounded-full bg-blue-50 text-gray-700'>39</p>
            </div>
            <div className='border-b border-gray-300 my-4'></div>
            <div>
                <p className='flex justify-between my-2'>Base Fare {'(1 Seats)'} <span>$52</span></p>
                <p className='flex justify-between my-2'>Service Fee <span>$2</span></p>
                <p className='flex justify-between my-2 font-bold text-xl'>Total <span className='text-blue-700'>$54</span></p>
            </div>

        <button className='btn-primary w-full'>Proceed to Payment</button>


        </div>

    </div>
  )
}

export default PassengerDetails