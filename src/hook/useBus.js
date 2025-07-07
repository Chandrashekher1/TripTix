// useBus.js
import { useContext } from "react";
import { BusContext } from "../context/BusProvider";

const useBus = () => useContext(BusContext);
export default useBus;
