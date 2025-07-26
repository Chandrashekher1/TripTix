import React from 'react'
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";

const TrackBus = () => {

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
        <div className='py-8 border-b border-b-gray-800 bg-[#f5fefa] min-h-screen'>
        <h1 className='text-center font-bold text-3xl md:text-4xl text-black'>Track Your Bus</h1>
        <p className='text-center text-gray-700 my-2'>Enter your booking ID or bus number to track real-time location</p>

        <div className='md:mx-60 mx-4'>
            <div>
            <form action="" className='flex border border-transparent bg-white py-6 px-4 my-4 rounded-lg shadow-xl w-full' onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder='Enter booking ID or bus number' className='p-2 rounded-lg border border-gray-200 text-gray-700 focus:outline-[#23a983] w-full'/>
                <button className='bg-[#39b290] text-white rounded-lg px-4 py-2 hover:bg-[#23a983] flex font-semibold mx-4 cursor-pointer'><CiSearch style={{marginTop:'4px', marginRight:'4px', fontSize:'20px'}}/> Track</button>
            </form>
        </div>
        </div>
    </div>
    </motion.div>
    
  )
}

export default TrackBus