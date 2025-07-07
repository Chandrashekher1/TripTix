import React from 'react'
import { Link } from 'react-router-dom'
import { LuBus, LuUser } from "react-icons/lu";
import { BsBrightnessHigh } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { token } from '../utils/icons/constant';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const Navbar = () => {
  return (
    <div className='flex '>
        <div className='flex  rounded-md px-4 py-2 text-blue-700 font-semibold bg-blue-200 cursor-pointer'>
            <IoIosSearch style={{fontSize:'20px' , marginTop:'3px'}}/>
            <Link className='mx-1 text-md' to="/">Search</Link>
        </div>
        <div className='flex  rounded-md px-4 py-2 hover:text-blue-700 mx-4 text-gray-500'>
            <LuBus style={{marginTop:'4', marginLeft:'4'}}/>
            <Link className='mx-1 text-md' to="track-bus">Track Bus</Link>
        </div>
         <div className='flex border border-gray-200 hover:bg-blue-100 rounded-md px-4 py-2 mx-4 cursor-pointer'>
            <LuUser style={{marginTop:'4', marginLeft:'4'}}/>
            {token ? (<Link className='mx-1 text-md font-semibold' to="/profile"> Profile</Link>) : (<Link className='mx-1 text-md font-semibold' to="/login"> Sign In</Link>) }
        </div>
        <div className='flex border border-gray-200 hover:bg-blue-100 rounded-md px-3 py-2 mx-4 cursor-pointer'>
            <BsBrightnessHigh style={{marginTop:'4', marginLeft:''}}/>

            <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select><command />
        </div>
    </div>
  )
}

export default Navbar