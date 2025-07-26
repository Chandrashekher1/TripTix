import React from 'react'
import { LuBus } from "react-icons/lu";
import SocialIcons from './SocialIcons';
import { LuPhone } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='dark bg-gray-950 px-4 py-8 md:flex flex-col justify-around md:px-16 '>
        <div className='md:flex justify-around '>
            <div className='md:w-80'>
            <h2 className='font-bold text-3xl flex text-[#23a983]'><span className='border border-transparent mx-2 rounded-lg text-white bg-[#23a983] px-2'>T</span>TripTix</h2>
            <p className='text-gray-400 my-4 '>Your trusted partner for Comfortable and safe bus travel across the country. Book your Journeywith confidence.</p>
            <SocialIcons/>
        </div>

        <div>
            <h1 className='text-2xl text-white my-4 font-bold'>Quick Links</h1>
            <ul className=''>
                <Link to='/track-bus'><li className='text-gray-400 my-2 hover:text-white hover:cursor-pointer'>Track Bus</li></Link>
                <Link to='/profile'><li className='text-gray-400 my-2 hover:text-white hover:cursor-pointer'>My Booking</li></Link>
            </ul>

        </div>
        <div>
            <h1 className='text-2xl text-white my-4 font-bold'>Contact Us</h1>
            <a href="callto:9990418622" className='flex text-gray-400'>{<LuPhone style={{color:'teal' , fontSize:'20px', marginTop:'3px' , marginRight:'6px'}}/>} +91-9990418622</a>
            <a href="mailto:cpsaw999041@gmail.com" className='flex text-gray-400 my-2'>{<MdOutlineMail style={{color:'teal' , fontSize:'20px', marginTop:'3px' , marginRight:'6px'}}/>} support@triptix.com</a>
            <p className='flex '><IoLocationOutline style={{marginTop:'4px', color:"teal", marginRight:'4px',fontSize:'20px'}}/><span className='text-gray-400'>123 Travel Street transport City, TC 12345</span></p>
        </div>
        </div>
        <div className='border-t border-gray-900 text-gray-400 text-center mt-8 md:flex justify-between'>
            <p className='mt-8'>@2025 TripTix. All rights reserved.</p>
            <div className='mt-8'>
                <Link className='mx-4 hover:text-white hover:cursor-pointer'>Privacy Policy</Link>
                <Link className='hover:text-white hover:cursor-pointer'>Terms of Service</Link>
                <Link className='mx-4 hover:text-white hover:cursor-pointer'>Cookies</Link>

            </div>
        </div>
    </div>
  )
}

export default Footer