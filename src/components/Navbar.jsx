import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuBus, LuUser } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Login from './Login';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const location = useLocation()
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleProfileClick = () => {
    if (token) {
      navigate('/profile');
    } else {
      handleOpen();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Link
        to="/"
          className={`hidden md:flex items-center rounded-md px-4 py-2 font-medium transition
            ${location.pathname === '/' ? 'bg-green-50 text-[#23a983]' : 'hover:bg-green-50 hover:text-[#23a983]'}
          `}
        >
          <IoIosSearch className="text-xl mr-1" />
          Search
        </Link>

        <Link
          to="/track-bus"
          className={`hidden md:flex items-center rounded-md px-4 py-2 font-medium transition
            ${location.pathname === '/track-bus' ? 'bg-green-50 text-[#23a983]' : 'hover:bg-green-50 hover:text-[#23a983]'}
          `}
        >
          <LuBus className="text-lg mr-1" />
          Track Bus
      </Link>

      <Button
        onClick={handleProfileClick}
        variant="text"
        sx={{
          color: location.pathname === '/profile' ? '#23a983' : 'black',
          backgroundColor: location.pathname === '/profile' ? '#f0fdf4' : 'transparent',
          px: 2.5,
          py: 1.2,
          textTransform: 'none',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '&:hover': {
            backgroundColor: '#f0fdf4',
            color: '#23a983'
          }
        }}
      >
        <LuUser className="text-lg" />
        {token ? 'Profile' : 'Sign In'}
      </Button>


      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          borderRadius: 9
        }}
      >
        <Box>
          {!token && <Login onClose={handleClose} />}
        </Box>
      </Dialog>
    </div>
  );
};

export default Navbar;
