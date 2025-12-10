import { useEffect, useContext, useState } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { BookingContext } from "../context/BookingContext";
import { getCourts } from "../services/courtService";
import { getEquipment } from "../services/equipmentService";
import { getCoaches } from "../services/coachService";
import { createBooking } from "../services/bookingService";
import CourtCard from "../components/CourtCard";
import EquipmentSelector from "../components/EquipmentSelector";
import CoachSelector from "../components/CoachSelector";
import TimeSlotSelector from "../components/TimeSlotSelector";
import PriceBreakdown from "../components/PriceBreakdown";

export default function BookingPage() {
  const {
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
  } = useContext(BookingContext);

  const [courts, setCourts] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCourts().then((res) => setCourts(res.data));
    getEquipment().then((res) => setEquipmentList(res.data));
    getCoaches().then((res) => setCoaches(res.data));
  }, []);

  const handleEquipmentChange = (item, qty) => {
    const updated = [...selectedEquipment];
    const index = updated.findIndex((e) => e.equipmentId === item._id);

    if (qty === 0) {
      if (index > -1) updated.splice(index, 1);
    } else {
      if (index > -1) updated[index].quantity = qty;
      else updated.push({ equipmentId: item._id, quantity: qty });
    }

    setSelectedEquipment(updated);
  };

  const handleConfirmBooking = async () => {
    if (!selectedCourt || !selectedTime.start || !selectedTime.end) {
      setMessage("Please select court, date, and time.");
      return;
    }

    const payload = {
      user: "TEST_USER_ID",
      court: selectedCourt._id,
      coach: selectedCoach ? selectedCoach._id : null,
      equipment: selectedEquipment,
      startTime: selectedTime.start,
      endTime: selectedTime.end,
    };

    try {
      const res = await createBooking(payload);
      setMessage("Booking successful!");
    } catch (err) {
      setMessage(err.response.data.message || "Booking failed.");
    }
  };

  return (
    <Container className="mt-4">
      {message && <Alert variant="info">{message}</Alert>}

      <Row>
        <Col md={4}>
          <h4>Select Court</h4>
          {courts.map((court) => (
            <CourtCard
              key={court._id}
              court={court}
              onSelect={setSelectedCourt}
            />
          ))}
        </Col>

        <Col md={4}>
          <h4>Select Equipment</h4>
          {equipmentList.map((eq) => (
            <EquipmentSelector
              key={eq._id}
              equipment={eq}
              onChange={handleEquipmentChange}
            />
          ))}

          <h4 className="mt-4">Select Coach (Optional)</h4>
          <CoachSelector coaches={coaches} onSelect={setSelectedCoach} />
        </Col>

        <Col md={4}>
          <h4>Select Time Slot</h4>
          <TimeSlotSelector onSelect={setSelectedTime} />

          <h4 className="mt-4">Price Breakdown</h4>
          <PriceBreakdown
            court={selectedCourt}
            equipment={selectedEquipment}
            coach={selectedCoach}
            selectedTime={selectedTime}
            onPrice={(p) => setPriceBreakdown(p)}
          />

          <Button className="mt-3" onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
