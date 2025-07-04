import React from 'react'
import SearchBar from '../components/SearchBar'

const Home = () => {
  return (
    <div className='home'>
        <div className='text-center px-4 py-8'>
            <h1 className='font-bold text-4xl'>Your Journey Starts Here</h1>
            <p className='my-4 text-xl text-gray-600'>Book Comfortable bus tickets across the country with real-time seat selection</p>
        </div>
        <SearchBar/>
    </div>
  )
}

export default Home