import { useEffect, useState } from "react";
import api from "../services/apiClient";

export default function PriceBreakdown({
  court,
  equipment,
  coach,
  selectedTime,
  onPrice,
}) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (!court || !selectedTime.start) return;

    api
      .post("/bookings/calc-price", {
        court: court._id,
        coach: coach ? coach._id : null,
        equipment,
        startTime: selectedTime.start,
        endTime: selectedTime.end,
      })
      .then((res) => {
        setPrice(res.data);
        onPrice(res.data);
      });
  }, [court, equipment, coach, selectedTime]);

  if (!price) return <div>No price yet...</div>;

  return (
    <div>
      <p>Base Price: ₹{price.basePrice}</p>
      <p>Indoor Premium: ₹{price.indoorPremium}</p>
      <p>Peak Fee: ₹{price.peakFee}</p>
      <p>Weekend Fee: ₹{price.weekendFee}</p>
      <p>Equipment Fee: ₹{price.equipmentFee}</p>
      <p>Coach Fee: ₹{price.coachFee}</p>
      <h5>Total: ₹{price.total}</h5>
    </div>
  );
}
