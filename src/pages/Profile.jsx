import React, { useContext, useEffect, useState } from 'react';
import { LuUser } from "react-icons/lu";
import { Profile_API} from '../utils/constant';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const Profile = () => {
  const [isProfile, setIsProfile] = useState(false);
  const [data, setData] = useState({});
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const id = localStorage.getItem('userId');
  const { logout ,token } = useContext(AuthContext);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  
  useEffect(() => {
    fetchUser();
  }, [])

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
          <div className='bg-white text-black px-4 border border-transparent py-8 rounded-lg my-8 shadow-lg'>
            <p className='font-semibold text-xl text-gray-700'>No Booking Details found.</p>
          </div>
        )}
      </div>
    </div>

      </motion.div>

   
  );
};

export default Profile;
