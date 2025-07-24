import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        className="hidden md:flex items-center rounded-md px-4 py-2 text-white hover:text-blue-500 font-medium transition"
      >
        <IoIosSearch className="text-xl mr-1" />
        Search
      </Link>

      <Link
        to="/track-bus"
        className="hidden md:flex items-center rounded-md px-4 py-2 text-white hover:text-blue-500 font-medium transition"
      >
        <LuBus className="text-lg mr-1" />
        Track Bus
      </Link>

      <Button
        onClick={handleProfileClick}
        variant="contained"
        sx={{
          background: 'linear-gradient(to right, #21d4fd, #00c9ff)',
          color: '#fff',
          px: 2.5,
          py: 1.2,
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          '&:hover': {
            background: 'linear-gradient(to right, #00c9ff, #21d4fd)',
          },
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <LuUser className="text-lg" />
        {token ? 'Profile' : 'Sign In'}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: 3,
            backgroundColor: '#060e23',
            color: 'white',
            minWidth: { xs: '90vw', sm: 400 },
            maxWidth: '95vw'
          }
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
