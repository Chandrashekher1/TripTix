import React from 'react'
import {motion} from "framer-motion"

const OpenPage = () => {
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
    <div className='flex flex-col justify-center bg-[#f5fefa] items-center min-h-screen'>
        <h1 className='font-bold text-2xl md:text-2xl  mx-1 md:mx-2 text-black'> <span className='border rounded-lg text-white bg-[#23a983] px-2'>T</span> TripTix</h1>
        <img src="https://c.tenor.com/XV6yYDYHih8AAAAd/tenor.gif" alt="" className='md:w-[70vw] md:h-[70vh] rounded-2xl p-4 bg-green-50'/>
    </div>
    </motion.div>
  )
}

export default OpenPage