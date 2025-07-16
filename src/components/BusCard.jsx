import React, { useEffect, useState } from 'react';
import useBus from '../hook/useBus';
import { useNavigate } from 'react-router-dom';
import { Bus_API } from '../utils/constant';

const BusCard = () => {
  const [listOfBuses, setListOfBuses] = useState([]);
  const searchData = useBus();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`${Bus_API}/topRated`);
        if (!response.ok) throw new Error("Failed to fetch bus data");
        const json = await response.json();
        setListOfBuses(json || []);
      } catch (err) {
        console.log("Error:", err.message);
      }
    };
    fetchBus();
  }, []);

  const handleBookNow = (bus) => {
    if (!bus || !bus.routesId) return;

    const route = {
      origin: bus.routesId.origin || "",
      destination: bus.routesId.destination || "",
    };

    searchData?.setRouteDetails?.(route);
    navigate('/available-seat');
  };

  if (listOfBuses.length === 0) {
    return (
      <div className="mx-4 mt-8 text-center text-gray-600 font-medium">
        No top-rated buses found.
      </div>
    );
  }

  return (
    <div className="mx-4 flex flex-wrap justify-center md:p-16">
      {listOfBuses.map((bus, index) => (
        <div
          key={index}
          className="w-96 shadow bg-white hover:shadow-2xl cursor-pointer mx-4 my-4 rounded-md border border-gray-200 transition duration-300"
        >
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20230717/pngtree-d-rendering-of-a-white-isolated-background-featuring-a-medium-sized-image_3893569.jpg"
            alt="Bus"
            className="rounded-t-md w-full h-48 object-cover"
          />
          <div className="p-4">
            <h1 className="font-semibold text-lg">{bus?.operator || "Luxury Express"}</h1>
            <p className="text-blue-700 font-semibold">
              {bus?.routesId?.origin || "Unknown"} {'->'} {bus?.routesId?.destination || "Unknown"}
            </p>
            <div className="flex flex-wrap my-2">
              {bus.isAc && <p className="border px-2 border-transparent bg-blue-50 rounded-full mx-2 my-2">AC</p>}
              {bus.isSleeper && <p className="border px-2 border-transparent bg-blue-50 rounded-full mx-2 my-2">Sleeper</p>}
              {bus.isSeater && <p className="border px-2 border-transparent bg-blue-50 rounded-full mx-2 my-2">Seater</p>}
              {bus.isWifi && <p className="border px-2 border-transparent bg-blue-50 rounded-full mx-2 my-2">WiFi</p>}
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-green-900 font-bold text-xl">₹{bus?.price || 0}</p>
              <button
                className="btn-primary hover:cursor-pointer hover:scale-105"
                onClick={() => handleBookNow(bus)}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusCard;
