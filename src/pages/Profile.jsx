import React, { useEffect, useState } from 'react'
import { LuBus, LuUser } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { FiCalendar, FiGift } from 'react-icons/fi';
import { MdOutlineWatchLater } from 'react-icons/md';
import { Profile_API, token } from '../utils/constant';

const Profile = () => {
    const [isprofile, setIsProfile] = useState(false)
    const [data,setData] = useState([])
    const [editName,setEditName] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editMode,setEditMode] = useState(false)
    const id = localStorage.getItem('user')

    const fetchUser = async() => {
        try{
            const userData = await fetch(`${Profile_API}/me`,{
                method: 'GET',
                headers:{
                    Authorization: token,
                    "Content-Type":"application/json"
                },
            })
            const json = await userData.json()
            setData(json.data)
            setEditName(json.data.name)
            setEditEmail(json.data.email)
            setEditPhone(json.data.phone)
            setEditMode(false)
        }
        catch(err){
            console.log("Error:", err.message);
        }
    }

     const updateUser = async () => {
        try{
            const res = await fetch(`${Profile_API}/${id}`, {
                method:'PATCH',
                headers:{
                    Authorization : token,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({email: editEmail,name:  editName, phone:editPhone})
            })

            const json = await res.json()
            setData(json.data);
            setEditName(json.data.name);
            setEditEmail(json.data.email);
            setEditPhone(json.data.phone);
            setEditMode(false);
        }
        catch(err){
            console.error("Error:" , err.message)
        }

    }
    useEffect(() => {
        fetchUser()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('authorization')
        window.location.href = '/login'
    }
  return (
    <div className='home'>
        <div className='flex items-center justify-center flex-col py-8'>
            <span className='rounded-full p-4 bg-gradient-to-r from-blue-500 to-teal-500'>{<LuUser style={{fontSize:'40px'}}/>}</span>
            <h1 className='font-bold text-3xl my-4 text-gray-900'>{data.name}</h1>
            <p className='flex text-gray-700'>{data.email} <span className='mx-4'> <li>{data.phone}</li></span></p>
        </div>
        <div className='flex mx-4 my-4 text-gray-700 border border-transparent bg-blue-50 py-1 rounded-md justify-around md:mx-60'>
            <button
                className={`cursor-pointer w-full py-2 rounded-md mx-1 font-semibold ${
                isprofile ? 'bg-white text-black' : 'bg-transparent'
                }`}
                onClick={() => setIsProfile(true)}
            >
                My Bookings
            </button>
            <button
                className={`cursor-pointer w-full py-2 rounded-md mx-1 font-semibold ${
                !isprofile ? 'bg-white text-black' : 'bg-transparent'
                }`}
                onClick={() => setIsProfile(false)}
            >
                Profile Settings
            </button>
        </div>

        <div className='mx-4 my-4 md:my-8 md:mx-60'>
            {!isprofile && <div className='bg-white border border-transparent shadow-md px-4 rounded-md'>
                <h1 className='font-semibold text-xl my-4'>Personal Information</h1>
                <div className='my-4'>
                    <label htmlFor="" className='text-gray-700 font-semibold'>Full Name</label>
                    {editMode ? (
                        <input value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                            className='border w-full px-2 py-1 rounded-md my-2'
                         />
                    ) : <p className='text-gray-700'>{data?.name}</p>}
                    <label htmlFor="" className='text-gray-700 font-semibold mt-12'>Email</label>
                    {editMode ? (
                        <input value={editEmail} 
                            onChange={(e) => setEditEmail(e.target.value)}
                            className='border w-full px-2 py-1 rounded-md my-2'
                         />
                    ) : <p className='text-gray-700'>{data?.email}</p>}
                    <label htmlFor="" className='font-semibold text-gray-700'>Phone</label>
                    {editMode ? (
                        <input value={editPhone} 
                            onChange={(e) => setEditPhone(e.target.value)}
                            className='border w-full px-2 py-1 rounded-md my-2'
                         />
                    ) : <p className='text-gray-700'>{data?.phone}</p>}
                </div>
                <div className='flex justify-between items-center'>
                    
                    {editMode ? (
                        <button className='btn-primary my-8' onClick={updateUser}>Save Changes</button>
                        ) : (
                        <button className='btn-primary my-8 cursor-pointer' onClick={() => setEditMode(true)}>Edit Profile</button>
                    )}
                    <button className='border bg-red-700 border-transparent font-semibold text-white py-2 px-2 rounded-md hover:bg-red-500 cursor-pointer' onClick={handleLogout}>Logout</button>
                </div>

            </div>}
            {isprofile && <div className=' bg-white px-4 border border-transparent py-8 rounded-md my-8 shadow-md '>
                <div className='flex justify-between'>
                    <h1 className='flex flex-col font-semibold text-lg'>Swift Travels <span className='text-sm text-gray-700'>Booking ID : RR12345678</span></h1>
                    <p className='bg-red-100 font-semibold py-2 rounded-full text-red-700 px-4'>Cancelled</p>
                </div>
                <div className='my-4'>
                    <p className='flex'><IoLocationOutline style={{marginTop:'4px', color:'blue', marginRight:'4px'}}/> Chicago {'->'} Detroit</p>
                    <p className='flex my-4'><FiCalendar style={{color:'green' , fontSize:'px', marginTop:'4px', marginRight:'4px'}}/> 2025-06-10</p>
                    <span className=' flex'><MdOutlineWatchLater style={{color:'orange', fontSize:'20px', marginTop:'4px'}}/>11:45</span>
                </div>
                <div>
                    <p className='text-gray-700 flex- flex-col'>Seats <span className='broder text-black'>15</span></p>
                    <p className='text-gray-700'>Amount: <span className='font-semibold'>$38</span></p>

                </div>
            </div>}
        </div>
    </div>
  )
}

export default Profile