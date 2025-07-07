import React from 'react';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const SocialIcons = () => {
    return (
        <div style={{ display: 'flex', gap: '20px',marginLeft:'0px', marginTop:'20px' }}>
            <a 
                href="https://x.com/cpsaw03" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600"
            >
                <FaTwitter size={30} />
            </a>
            <a 
                href="https://www.linkedin.com/in/chandrashekher-prasad-a496a2293/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className= "text-blue-700"
            >
                <FaLinkedin size={30} />
            </a>
            <a 
                href="https://www.instagram.com/_chandrashekher_03/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-pink-800"
            >
                <FaInstagram size={30} />
            </a>
        </div>
    );
};

export default SocialIcons;