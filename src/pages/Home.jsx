import React from 'react';
import SearchBar from '../components/SearchBar';
import BusCard from '../components/BusCard';
import WhyChoose from '../components/WhyChoose';
import Feedback from '../components/Feedback';

const Home = () => {
  return (
    <div>
     
      <div className="relative w-full h-[400px] bg-gray-100">
        <img
          src="src/components/heroBus.jpg"
          alt="Hero Bus"
          className="w-full h-full object-cover object-center"
        />

        <div className="absolute top-[75%] left-1/2 w-full max-w-6xl px-4 transform -translate-x-1/2 -translate-y-1/2 ">
          <SearchBar />
        </div>
      </div>

      <div className="bg-white py-4 my-8">
        <div className="md:w-[60vw] md:mx-auto mx-4 flex flex-col items-center justify-center my-auto">
          <h1 className="font-bold text-3xl md:text-4xl text-center my-4">
            Why choose <span className="text-[#23a983]">TripTix?</span>
          </h1>
          <p className="text-gray-500 text-center text-xl">
            Experience the future of bus travel with our cutting-edge features designed to make your journey smooth and worry-free.
          </p>
        </div>
        <WhyChoose />
      </div>

      <div className="bg-white py-20">
        <h1 className="font-bold text-3xl text-center">
          Top Travel <span className="text-[#23a983] font-bold">Buses</span>
        </h1>
        <p className="my-4 text-center text-gray-700 text-xl">
          Discover our most popular routes with premium buses, great amenities, and unbeatable prices.
        </p>
        <BusCard />
      </div>

      <div className="bg-[#f5fefa] py-24">
        <h1 className="font-semibold text-4xl text-center ">
          What Our <span className="text-[#23a983] font-bold">Riders</span> Say
        </h1>
        <Feedback />
      </div>
    </div>
  );
};

export default Home;
