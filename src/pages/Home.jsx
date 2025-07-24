import React from 'react'
import SearchBar from '../components/SearchBar'
import BusCard from '../components/BusCard'
import OfferCard from '../components/OfferCard'
import WhyChoose from '../components/WhyChoose'

const Home = () => {
  return (
    <div className='bg-gray-950'>
        <div className='text-center px-4 py-8'>
            <h1 className='font-bold text-4xl text-white'>Find Your Perfect Journey</h1>
            <p className='my-4 text-xl text-gray-400'>Book Comfortable bus tickets across the country with real-time seat selection</p>
        </div>

        <div>
            
        </div>
        <SearchBar/>

        <div className='bg-[#050b1c] py-4 my-8'>
          <div className='md:w-[60vw] md:mx-auto mx-4 flex flex-col items-center justify-center my-auto'>
               <h1 className='font-bold text-3xl md:text-4xl text-center my-4 text-white '>Why choose TripTix?</h1>
                <p className='text-gray-400 text-center text-xl'>Experience the future of bus travel with our cutting-edge features designed to make your journey smooth and worry-free.</p>
          </div>
          <WhyChoose/>
        </div>
        <div className='border-b border-b-gray-800 py-12'>
            <h1 className='font-bold text-3xl text-center text-white'>Top Travel Buses</h1>
            <p className='my-4 text-center text-gray-400 text-xl'>Discover our most popular routes with premium buses, great amenities, and unbeatable prices.</p>
            <BusCard/>
        </div>
    </div>
  )
}

export default Home