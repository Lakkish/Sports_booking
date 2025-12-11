import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  ProgressBar,
  Badge,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaRupeeSign,
  FaUserTie,
  FaTools,
} from "react-icons/fa";
import * as useBooking from "../../hooks/useBooking";
import { useApi } from "../../hooks/useApi";

import * as bookingService from "../../services/bookingService";
import * as courtService from "../../services/courtService";
import * as coachService from "../../services/coachService";
import * as equipmentService from "../../services/equipmentService";
import {
  formatPrice,
  formatTimeSlot,
  getTimeSlotsForDate,
} from "../../utils/dateUtils";
import CourtCard from "../../components/booking/CourtCard";
import CoachSelector from "../../components/booking/CoachSelector";
import EquipmentSelector from "../../components/booking/EquipmentSelector";
import TimeSlotSelector from "../../components/booking/TimeSlotSelector";
import PriceBreakdown from "../../components/booking/PriceBreakdown";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedCourt,
    setSelectedCourt,
    selectedEquipment,
    setSelectedEquipment,
    selectedCoach,
    setSelectedCoach,
    selectedTime,
    setSelectedTime,
    resetBooking,
    isBookingComplete,
    getBookingSummary,
  } = useBooking();
  const { post, isLoading, error, clearError } = useApi();

  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [bookingStep, setBookingStep] = useState(1);

  const selectedDate = location.state?.selectedDate;

  useEffect(() => {
    loadResources();

    // Reset if coming from home without court selection
    if (!selectedCourt && selectedDate) {
      navigate("/");
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const slots = getTimeSlotsForDate(selectedDate);
      setTimeSlots(slots);
    }
  }, [selectedDate]);

  const loadResources = async () => {
    try {
      const [courtsData, coachesData, equipmentData] = await Promise.all([
        courtService.getCourts(true),
        coachService.getCoaches(true),
        equipmentService.getEquipment(),
      ]);

      setCourts(courtsData);
      setCoaches(coachesData);
      setEquipmentList(equipmentData);
    } catch (err) {
      setMessage("Failed to load resources. Please try again.");
    }
  };

  const handleEquipmentChange = (equipment, quantity) => {
    const existingIndex = selectedEquipment.findIndex(
      (item) => item.equipmentId === equipment._id
    );

    const updated = [...selectedEquipment];

    if (quantity === 0) {
      if (existingIndex > -1) {
        updated.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex > -1) {
        updated[existingIndex].quantity = quantity;
      } else {
        updated.push({
          equipmentId: equipment._id,
          quantity,
          name: equipment.name,
          pricePerUnit: equipment.pricePerUnit,
        });
      }
    }

    setSelectedEquipment(updated);
  };

  const handleConfirmBooking = async () => {
    if (!isBookingComplete()) {
      setMessage("Please complete all required selections.");
      return;
    }

    const payload = {
      court: selectedCourt._id,
      coach: selectedCoach ? selectedCoach._id : null,
      equipment: selectedEquipment.map((e) => ({
        equipmentId: e.equipmentId,
        quantity: e.quantity,
      })),
      startTime: selectedTime.start,
      endTime: selectedTime.end,
    };

    try {
      await post(bookingService.createBooking, payload);

      setMessage("Booking successful! Redirecting to history...");

      // Reset booking and redirect
      setTimeout(() => {
        resetBooking();
        navigate("/history");
      }, 2000);
    } catch (err) {
      // Error is handled by useApi hook
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: "Court", active: bookingStep === 1 },
      { number: 2, label: "Extras", active: bookingStep === 2 },
      { number: 3, label: "Time", active: bookingStep === 3 },
      { number: 4, label: "Confirm", active: bookingStep === 4 },
    ];

    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <ProgressBar now={bookingStep * 25} className="mb-3" />
          <Row className="text-center">
            {steps.map((step) => (
              <Col key={step.number}>
                <div
                  className={`d-flex flex-column align-items-center ${
                    step.active ? "text-primary" : "text-muted"
                  }`}
                >
                  <div
                    className={`rounded-circle ${
                      step.active ? "bg-primary" : "bg-secondary"
                    } text-white d-flex align-items-center justify-content-center mb-2`}
                    style={{ width: "40px", height: "40px" }}
                  >
                    {step.number}
                  </div>
                  <span className="fw-bold">{step.label}</span>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const renderBookingSummary = () => {
    const summary = getBookingSummary();

    return (
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Booking Summary</h5>
        </Card.Header>
        <Card.Body>
          {selectedCourt && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="mb-1">
                  <FaCheckCircle className="text-success me-2" />
                  {selectedCourt.name}
                </h6>
                <small className="text-muted">
                  {selectedCourt.type.toUpperCase()}
                </small>
              </div>
              <Badge bg="primary">
                {formatPrice(selectedCourt.basePrice)}/hour
              </Badge>
            </div>
          )}

          {selectedCoach && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="mb-1">
                  <FaUserTie className="text-info me-2" />
                  {selectedCoach.name}
                </h6>
                <small className="text-muted">Coach</small>
              </div>
              <Badge bg="info">
                {formatPrice(selectedCoach.pricePerHour)}/hour
              </Badge>
            </div>
          )}

          {selectedEquipment.length > 0 && (
            <div className="mb-3">
              <h6 className="mb-2">
                <FaTools className="text-warning me-2" />
                Equipment
              </h6>
              {selectedEquipment.map((item) => (
                <div
                  key={item.equipmentId}
                  className="d-flex justify-content-between"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <small>
                    {formatPrice(item.quantity * item.pricePerUnit)}
                  </small>
                </div>
              ))}
            </div>
          )}

          {selectedTime.start && (
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">
                  <FaCalendarAlt className="text-success me-2" />
                  Time Slot
                </h6>
                <small className="text-muted">
                  {formatTimeSlot(selectedTime.start, selectedTime.end)}
                </small>
              </div>
              <Badge bg="success">Selected</Badge>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  if (isLoading && !selectedCourt) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading booking resources...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Complete Your Booking</h2>
        <p className="lead text-muted">Follow the steps to book your court</p>
      </div>

      {renderStepIndicator()}

      {message && (
        <Alert
          variant="info"
          dismissible
          onClose={() => setMessage("")}
          className="mb-4"
        >
          {message}
        </Alert>
      )}

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={clearError}
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      <Row>
        {/* Left Column - Selection */}
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                Step {bookingStep}:{" "}
                {bookingStep === 1
                  ? "Select Court"
                  : bookingStep === 2
                  ? "Add Extras"
                  : bookingStep === 3
                  ? "Choose Time"
                  : "Review & Confirm"}
              </h5>
            </Card.Header>
            <Card.Body>
              {bookingStep === 1 && (
                <div>
                  <h6 className="mb-3">Available Courts</h6>
                  <Row xs={1} md={2} className="g-3">
                    {courts.map((court) => (
                      <Col key={court._id}>
                        <CourtCard
                          court={court}
                          onSelect={setSelectedCourt}
                          isSelected={selectedCourt?._id === court._id}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {bookingStep === 2 && (
                <div>
                  <Row>
                    <Col md={6}>
                      <h6 className="mb-3">
                        <FaUserTie className="me-2" />
                        Select Coach (Optional)
                      </h6>
                      <CoachSelector
                        coaches={coaches}
                        selectedCoach={selectedCoach}
                        onSelect={setSelectedCoach}
                      />
                    </Col>
                    <Col md={6}>
                      <h6 className="mb-3">
                        <FaTools className="me-2" />
                        Add Equipment
                      </h6>
                      {equipmentList.map((eq) => (
                        <EquipmentSelector
                          key={eq._id}
                          equipment={eq}
                          selectedQuantity={
                            selectedEquipment.find(
                              (e) => e.equipmentId === eq._id
                            )?.quantity || 0
                          }
                          onChange={handleEquipmentChange}
                        />
                      ))}
                    </Col>
                  </Row>
                </div>
              )}

              {bookingStep === 3 && (
                <div>
                  <h6 className="mb-3">
                    <FaCalendarAlt className="me-2" />
                    Select Time Slot for {selectedDate}
                  </h6>
                  <TimeSlotSelector
                    timeSlots={timeSlots}
                    selectedTime={selectedTime}
                    onSelect={setSelectedTime}
                  />
                </div>
              )}

              {bookingStep === 4 && (
                <div className="text-center">
                  <FaCheckCircle size={80} className="text-success mb-4" />
                  <h4>Ready to Confirm?</h4>
                  <p className="text-muted mb-4">
                    Please review your booking details before confirmation
                  </p>
                  {renderBookingSummary()}
                </div>
              )}

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setBookingStep(Math.max(1, bookingStep - 1))}
                  disabled={bookingStep === 1}
                >
                  Previous
                </Button>

                {bookingStep < 4 ? (
                  <Button
                    variant="primary"
                    onClick={() => setBookingStep(bookingStep + 1)}
                    disabled={
                      (bookingStep === 1 && !selectedCourt) ||
                      (bookingStep === 3 && !selectedTime.start)
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={handleConfirmBooking}
                    disabled={!isBookingComplete() || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Price & Summary */}
        <Col lg={4}>
          {renderBookingSummary()}

          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <FaRupeeSign className="me-2" />
                Price Breakdown
              </h5>
            </Card.Header>
            <Card.Body>
              <PriceBreakdown
                court={selectedCourt}
                equipment={selectedEquipment}
                coach={selectedCoach}
                selectedTime={selectedTime}
              />
            </Card.Body>
          </Card>

          <Button
            variant="outline-danger"
            onClick={resetBooking}
            className="w-100 mt-3"
          >
            Reset Booking
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
