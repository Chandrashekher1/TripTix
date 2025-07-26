import React from 'react'
import { MdOutlineSecurity, MdPayment } from "react-icons/md";
import { FaRobot } from "react-icons/fa6";
import { IoLocationOutline, IoReload } from "react-icons/io5";
import { CiMobile2 } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";

const WhyChoose = () => {
  return (
    <div className="px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="bg-white md:p-6 p-4 rounded-xl border border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-0 transition-all duration-300 flex justify-center flex-col items-center">
          <span className="rounded-full md:p-4 p-3 bg-[#f5fefa]  inline-block ">
            <MdOutlineSecurity className='md:text-4xl text-xl text-blue-600 hover:scale-105' />
          </span>
          <h3 className="text-xl font-semibold md:my-4 my-2">Live Seat Locking</h3>
          <p className="text-gray-700 text-center">Real-time seat reservation with instant confirmation. Never lose your preferred seat to someone else.</p>
        </div>

        <div className="bg-white md:p-6 p-4 rounded-xl border border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-0 transition-all duration-300 flex justify-center flex-col items-center">
          <span className="rounded-full p-4 inline-block bg-[#f5fefa] ">
            <FaRobot className='md:text-4xl text-xl text-gray-600 ' />
          </span>
          <h3 className=" text-xl font-semibold md:my-4 my-2">ChatBot Help</h3>
          <p className="text-gray-700">Help is just a message away—24/7 chatbot for smooth and stress-free support.</p>
        </div>

        <div className="bg-white md:p-6 p-4 rounded-xl border border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-0 transition-all duration-300 flex justify-center flex-col items-center">
          <span className="rounded-full p-4 bg-[#f5fefa]  inline-block">
            <IoLocationOutline className='md:text-4xl text-2xl text-blue-700'  />
          </span>
          <h3 className="text-xl font-semibold md:my-4 my-2">Real-time Bus Tracking</h3>
          <p className="text-gray-700">Track your bus location live with GPS accuracy. Know exactly when your bus will arrive.</p>
        </div>

        <div className="bg-white md:p-6 p-4 rounded-xl border border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-0 transition-all duration-300 flex justify-center flex-col items-center">
          <span className="rounded-full p-4 bg-[#f5fefa]  inline-block">
            <MdPayment className='md:text-4xl text-2xl text-orange-700' />
          </span>
          <h3 className=" text-xl font-semibold md:my-4 my-2">Secure Payment Gateway</h3>
          <p className="text-gray-700">Multiple payment options with bank-level security. Pay confidently using your preferred method.</p>
        </div>

        <div className="bg-white md:p-6 p-4 rounded-xl border border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-0 transition-all duration-300 flex justify-center flex-col items-center">
          <span className="rounded-full p-4 bg-[#f5fefa]  inline-block">
            <CiMobile2 className='md:text-4xl text-2xl text-blue-700' />
          </span>
          <h3 className="text-xl font-semibold my-4">User-friendly Interface</h3>
          <p className="text-gray-700">Intuitive design that works perfectly on all devices. Book tickets in just a few taps.</p>
        </div>

        <div className="bg-white md:p-6 p-4 rounded-xl border border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-0 transition-all duration-300 flex justify-center flex-col items-center">
          <span className="rounded-full p-4 bg-[#f5fefa]  inline-block">
            <FiUsers className='md:text-4xl text-2xl text-orange-700' />
          </span>
          <h3 className="text-xl font-semibold md:my-4 my-2">Secure Login & Signup</h3>
          <p className="text-gray-700">Your data is protected with encryption. Quick login via Google or other methods.</p>
        </div>

        <div className="bg-white md:p-6 p-4 rounded-xl border border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-0 transition-all duration-300 flex justify-center flex-col items-center">
          <span className="rounded-full p-4 bg-[#f5fefa]  inline-block">
            <IoReload className='md:text-4xl text-2xl text-red-700' />
          </span>
          <h3 className=" text-xl font-semibold md:my-4 my-2">Easy Cancellation</h3>
          <p className="text-gray-700">Cancel anytime with instant refunds. Transparent cancellation policies for peace of mind.</p>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
