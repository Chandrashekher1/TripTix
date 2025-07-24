import React, { useContext, useEffect, useState } from 'react';
import { LuUser } from "react-icons/lu";
import { Profile_API} from '../utils/constant';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [isProfile, setIsProfile] = useState(false);
  const [data, setData] = useState({});
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const id = localStorage.getItem('userId');
  const { logout } = useContext(AuthContext);
  const token = localStorage.getItem('authorization')
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
    <div className='py-2 border-b border-b-gray-700'>
      <div className='flex items-center justify-center flex-col py-8'>
        <span className='rounded-full p-4 bg-gradient-to-r from-blue-500 to-teal-500'>
          <LuUser style={{ fontSize: '40px' }} />
        </span>
        <h1 className='font-bold text-3xl my-4 text-white'>{data.name}</h1>
        <p className='flex text-gray-400'>{data.email} <span className='mx-4'><li>{data.phone}</li></span></p>
      </div>

      <div className='flex mx-4 my-4 text-gray-700 border border-transparent bg-gray-900 py-1 rounded-md justify-around md:mx-60'>
        <button
          className={`cursor-pointer w-full py-2 rounded-md mx-1 font-semibold ${isProfile ? 'bg-[#060e23] text-white' : 'bg-transparent'}`}
          onClick={() => setIsProfile(true)}
        >
          My Bookings
        </button>
        <button
          className={`cursor-pointer w-full py-2 rounded-md mx-1 font-semibold ${!isProfile ? 'bg-[#060e23] text-white' : 'bg-transparent'}`}
          onClick={() => setIsProfile(false)}
        >
          Profile Settings
        </button>
      </div>

      <div className='mx-4 my-4 md:my-8 md:mx-60'>
        {!isProfile && (
          <div className='bg-[#060e23] text-white border border-transparent shadow-md px-4 rounded-md'>
            <h1 className='font-semibold text-2xl my-4'>Personal Information</h1>
            <div className='my-4'>
              <label className='text-gray-400 font-semibold'>Full Name</label>
              {editMode ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className='border w-full px-2 py-1 rounded-md my-2 text-gray-400'
                />
              ) : <p className='text-gray-100'>{data?.name}</p>}

              <label className='text-gray-400 font-semibold mt-4'>Email</label>
              {editMode ? (
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className='border w-full px-2 py-1 rounded-md my-2 text-gray-400'
                />
              ) : <p className='text-gray-100'>{data?.email}</p>}

              <label className='font-semibold text-gray-400'>Phone</label>
              {editMode ? (
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className='border w-full px-2 py-1 rounded-md my-2 text-gray-400'
                />
              ) : <p className='text-gray-100'>{data?.phone}</p>}
            </div>

            <div className='flex justify-between items-center'>
              {editMode ? (
                <button
                  className='bg-[#21d3ed] shadow-md text-black font-semibold px-4 py-2 rounded-md hover:bg-cyan-500 my-8'
                  onClick={updateUser}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  className='bg-[#21d3ed] shadow-md text-black font-semibold px-4 py-2 rounded-md hover:bg-cyan-500 my-8'
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
          <div className='bg-[#060e23] text-white px-4 border border-transparent py-8 rounded-md my-8 shadow-md'>
            <p className='font-semibold text-xl text-gray-700'>No Booking Details found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
