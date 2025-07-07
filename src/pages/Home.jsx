import React from 'react'
import SearchBar from '../components/SearchBar'
import BusCard from '../components/BusCard'
import OfferCard from '../components/OfferCard'
import WhyChoose from '../components/WhyChoose'

const Home = () => {
  return (
    <div className='home'>
        <div className='text-center px-4 py-8'>
            <h1 className='font-bold text-4xl'>Your Journey Starts Here</h1>
            <p className='my-4 text-xl text-gray-600'>Book Comfortable bus tickets across the country with real-time seat selection</p>
        </div>
        <SearchBar/>

        <div className='my-12'>
          <h1 className='font-bold text-3xl text-center'>Top Travel Buses</h1>
          <p className='my-4 text-center text-gray-700'>Premium comfort meets unbeatable prices</p>
          <BusCard/>
        </div>

        <div className=''>
          <h1 className='text-center font-bold text-3xl'>Special Offers</h1>
          <p className='text-center text-gray-700 my-4'>Don't mess out on these amazing deals</p>

          <OfferCard/>
        </div>

        <div className='bg-gradient-to-l from-blue-50 to-white my-8'>
          <h1 className='font-bold text-3xl text-center my-8 '>Why choose TripTix</h1>
          <WhyChoose/>
        </div>
    </div>
  )
}

export default Home