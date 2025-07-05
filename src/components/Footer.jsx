import React from 'react'
import { LuBus } from "react-icons/lu";
import SocialIcons from './SocialIcons';
import { LuPhone } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='bg-gray-950 px-4 py-8'>
        <div>
            <h2 className='text-white font-bold text-3xl flex'><span><LuBus style={{color: 'blue' , fontSize:'30px' , marginTop:'4', marginRight:'6px'}}/></span>TripTix</h2>
            <p className='text-gray-400 my-4'>Your trusted partner for Comfortable and safe bus travel across the country. Book your Journeywith confidence.</p>
            <SocialIcons/>
        </div>

        <div>
            <h1 className='text-2xl text-white my-4 font-bold'>Quick Links</h1>
            <ul>
                <li className='text-gray-400 my-2'>Search Buses</li>
                <li className='text-gray-400 my-2'>Track Bus</li>
                <li className='text-gray-400 my-2'>My Booking</li>
                <li className='text-gray-400 my-2'>Cancel Ticket</li>
                <li className='text-gray-400'>Help & Support </li>

            </ul>

        </div>
        <div>
            <h1 className='text-2xl text-white my-4 font-bold'>Popular Routes</h1>
            <ul>
                <li className='text-gray-400 my-2'>Search Buses</li>
                <li className='text-gray-400 my-2'>Track Bus</li>
                <li className='text-gray-400 my-2'>My Booking</li>
                <li className='text-gray-400 my-2'>Cancel Ticket</li>
                <li className='text-gray-400'>Help & Support </li>

            </ul>
        </div>
        <div>
            <h1 className='text-2xl text-white my-4 font-bold'>Contact Us</h1>
            <a href="callto:9990418622" className='flex text-gray-400'>{<LuPhone style={{color:'teal' , fontSize:'20px', marginTop:'3px' , marginRight:'6px'}}/>} +91-9990418622</a>
            <a href="mailto:cpsaw999041@gmail.com" className='flex text-gray-400 my-2'>{<MdOutlineMail style={{color:'teal' , fontSize:'20px', marginTop:'3px' , marginRight:'6px'}}/>} support@triptix.com</a>
            <p className='flex '><IoLocationOutline style={{marginTop:'4px', color:"teal", marginRight:'4px',fontSize:'20px'}}/><span className='text-gray-400'>123 Travel Street transport City, TC 12345</span></p>
        </div>
        <div className='border-t border-gray-900 text-gray-400 text-center my-4'>
            <p className='my-4'>@2025 TripTix. All rights reserved.</p>
            <div>
                <Link className='mx-4'>Privacy Policy</Link>
                <Link>Terms of Service</Link>
                <Link className='mx-4'>Cookies</Link>

            </div>
        </div>
    </div>
  )
}

export default Footer