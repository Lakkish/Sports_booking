import { useEffect, useState } from "react";
import api from "../services/apiClient";
import { Spinner } from "react-bootstrap";

export default function PriceBreakdown({
  court,
  equipment,
  coach,
  selectedTime,
  onPrice,
}) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!court || !selectedTime.start || !selectedTime.end) return;

    const fetchPrice = async () => {
      try {
        setLoading(true);

        const response = await api.post("/bookings/calc-price", {
          court: court._id,
          coach: coach ? coach._id : null,
          equipment: equipment,
          startTime: selectedTime.start,
          endTime: selectedTime.end,
        });

        setPrice(response.data);
        onPrice(response.data); // update the context/global price
      } catch (err) {
        console.error("Price calculation failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [court, equipment, coach, selectedTime]);

  if (!court) return <div>Select a court to see pricing.</div>;
  if (!selectedTime.start) return <div>Select a time slot to see pricing.</div>;
  if (loading) return <Spinner animation="border" size="sm" />;

  if (!price) return <div>No price calculated yet...</div>;

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
