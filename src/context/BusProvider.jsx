import React,{ createContext, useState } from "react";

export const BusContext = createContext();

const BusProvider = ({ children }) => {
  const [buses, setBuses] = useState([]);
  const [routeDetails, setRouteDetails] = useState({});

  return (
    <BusContext.Provider value={{ buses, setBuses, routeDetails, setRouteDetails }}>
      {children}
    </BusContext.Provider>
  );
};

export default BusProvider;
