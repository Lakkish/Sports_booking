import { createContext, useState } from "react";
export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedTime, setSelectedTime] = useState({});
  const [priceBreakdown, setPriceBreakdown] = useState({});

  return (
    <BookingContext.Provider
      value={{
        selectedCourt,
        setSelectedCourt,
        selectedEquipment,
        setSelectedEquipment,
        selectedCoach,
        setSelectedCoach,
        selectedTime,
        setSelectedTime,
        priceBreakdown,
        setPriceBreakdown,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
