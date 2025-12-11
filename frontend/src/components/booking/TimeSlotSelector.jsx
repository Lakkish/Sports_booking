import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Badge,
  Alert,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaClock,
  FaSun,
  FaMoon,
  FaCheck,
  FaExclamationTriangle,
  FaCalendarDay,
} from "react-icons/fa";
import {
  getTimeSlotsForDate,
  formatTimeSlot,
  isWeekend,
  isPeakHour,
  getTodayDate,
} from "../../utils/dateUtils";

export default function TimeSlotSelector({
  selectedDate = getTodayDate(),
  selectedTime = {},
  onSelect,
  disabledSlots = [],
  minHour = 5,
  maxHour = 22,
  slotDuration = 60, // minutes
}) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [filter, setFilter] = useState("all"); // all, morning, afternoon, evening, available

  // Generate time slots for the selected date
  useEffect(() => {
    if (selectedDate) {
      const slots = [];

      // Create slots from minHour to maxHour
      for (let hour = minHour; hour < maxHour; hour++) {
        const startHour = hour.toString().padStart(2, "0");
        const endHour = (hour + 1).toString().padStart(2, "0");

        const startTime = `${selectedDate}T${startHour}:00:00`;
        const endTime = `${selectedDate}T${endHour}:00:00`;

        const slot = {
          label: `${startHour}:00 - ${endHour}:00`,
          start: startTime,
          end: endTime,
          hour: hour,
          isWeekend: isWeekend(new Date(startTime)),
          isPeak: isPeakHour(startTime),
          isBooked: disabledSlots.some(
            (disabled) =>
              disabled.start === startTime ||
              (new Date(startTime) >= new Date(disabled.start) &&
                new Date(startTime) < new Date(disabled.end))
          ),
        };

        slots.push(slot);
      }

      setTimeSlots(slots);
    }
  }, [selectedDate, disabledSlots, minHour, maxHour]);

  // Filter time slots
  const filteredSlots = timeSlots.filter((slot) => {
    if (filter === "morning") return slot.hour >= 5 && slot.hour < 12;
    if (filter === "afternoon") return slot.hour >= 12 && slot.hour < 17;
    if (filter === "evening") return slot.hour >= 17 && slot.hour < 22;
    if (filter === "available") return !slot.isBooked;
    return true; // 'all'
  });

  // Get time of day label
  const getTimeOfDayLabel = (hour) => {
    if (hour < 12)
      return { label: "Morning", icon: <FaSun />, variant: "warning" };
    if (hour < 17)
      return { label: "Afternoon", icon: <FaSun />, variant: "info" };
    return { label: "Evening", icon: <FaMoon />, variant: "dark" };
  };

  // Get slot badge
  const getSlotBadge = (slot) => {
    if (slot.isBooked) {
      return <Badge bg="danger">Booked</Badge>;
    }
    if (slot.isPeak) {
      return <Badge bg="warning">Peak</Badge>;
    }
    if (slot.isWeekend) {
      return <Badge bg="info">Weekend</Badge>;
    }
    return <Badge bg="success">Available</Badge>;
  };

  // Get slot variant
  const getSlotVariant = (slot, isSelected) => {
    if (isSelected) return "primary";
    if (slot.isBooked) return "light";
    if (slot.isPeak) return "warning";
    if (slot.isWeekend) return "info";
    return "outline-primary";
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    if (!slot.isBooked) {
      onSelect({
        start: slot.start,
        end: slot.end,
        label: slot.label,
      });
    }
  };

  // Format selected date
  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate available slots
  const availableSlots = timeSlots.filter((slot) => !slot.isBooked).length;
  const totalSlots = timeSlots.length;

  return (
    <div className="time-slot-selector">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Select Time Slot
              </h5>
              {selectedDate && (
                <small className="opacity-75">
                  <FaCalendarDay className="me-1" />
                  {formatSelectedDate()}
                </small>
              )}
            </div>
            <Badge bg="light" text="dark" className="fs-6">
              {availableSlots} / {totalSlots} slots available
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Date Info */}
          {!selectedDate ? (
            <Alert variant="warning">
              <FaExclamationTriangle className="me-2" />
              Please select a date first to view available time slots.
            </Alert>
          ) : (
            <>
              {/* Filters */}
              <div className="mb-4">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {["all", "morning", "afternoon", "evening", "available"].map(
                    (filterType) => {
                      const labels = {
                        all: "All Slots",
                        morning: "Morning (5AM-12PM)",
                        afternoon: "Afternoon (12PM-5PM)",
                        evening: "Evening (5PM-10PM)",
                        available: "Available Only",
                      };

                      return (
                        <Button
                          key={filterType}
                          variant={
                            filter === filterType
                              ? "primary"
                              : "outline-primary"
                          }
                          size="sm"
                          onClick={() => setFilter(filterType)}
                        >
                          {labels[filterType]}
                        </Button>
                      );
                    }
                  )}
                </div>

                {/* Legend */}
                <div className="d-flex flex-wrap gap-3">
                  <small className="d-flex align-items-center">
                    <Badge
                      bg="success"
                      className="me-2"
                      style={{ width: "12px", height: "12px" }}
                    />
                    Regular
                  </small>
                  <small className="d-flex align-items-center">
                    <Badge
                      bg="warning"
                      className="me-2"
                      style={{ width: "12px", height: "12px" }}
                    />
                    Peak Hours
                  </small>
                  <small className="d-flex align-items-center">
                    <Badge
                      bg="info"
                      className="me-2"
                      style={{ width: "12px", height: "12px" }}
                    />
                    Weekend
                  </small>
                  <small className="d-flex align-items-center">
                    <Badge
                      bg="danger"
                      className="me-2"
                      style={{ width: "12px", height: "12px" }}
                    />
                    Booked
                  </small>
                </div>
              </div>

              {/* Selected Slot Display */}
              {selectedTime.start && (
                <Alert variant="success" className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Selected Time Slot:</strong>
                      <div className="h5 mb-0 mt-1">
                        <FaClock className="me-2" />
                        {formatTimeSlot(selectedTime.start, selectedTime.end)}
                      </div>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onSelect({})}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </Alert>
              )}

              {/* Time Slots Grid */}
              <div className="time-slots-grid">
                <Row xs={2} md={3} lg={4} className="g-3">
                  {filteredSlots.map((slot, index) => {
                    const isSelected = selectedTime.start === slot.start;
                    const timeOfDay = getTimeOfDayLabel(slot.hour);
                    const showTimeOfDay =
                      index === 0 ||
                      (filteredSlots[index - 1].hour < 12 && slot.hour >= 12) ||
                      (filteredSlots[index - 1].hour < 17 && slot.hour >= 17);

                    return (
                      <>
                        {showTimeOfDay && (
                          <Col xs={12} className="mt-4 mb-2">
                            <div className="d-flex align-items-center">
                              <Badge bg={timeOfDay.variant} className="me-2">
                                {timeOfDay.icon}
                              </Badge>
                              <h6 className="mb-0">{timeOfDay.label} Slots</h6>
                            </div>
                          </Col>
                        )}

                        <Col key={slot.start}>
                          <Button
                            variant={getSlotVariant(slot, isSelected)}
                            className={`w-100 h-100 py-3 time-slot-button ${
                              isSelected ? "selected" : ""
                            }`}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={slot.isBooked}
                          >
                            <div className="d-flex flex-column align-items-center">
                              <div className="h6 mb-1">{slot.label}</div>
                              <div className="small mb-2">
                                {getSlotBadge(slot)}
                              </div>
                              {isSelected && <FaCheck className="mt-1" />}
                            </div>
                          </Button>
                        </Col>
                      </>
                    );
                  })}
                </Row>
              </div>

              {filteredSlots.length === 0 && (
                <Alert variant="info" className="text-center mt-4">
                  <FaClock className="me-2" />
                  No time slots available for the selected filter.
                </Alert>
              )}
            </>
          )}
        </Card.Body>
        <Card.Footer className="text-muted">
          <div className="d-flex justify-content-between align-items-center">
            <small>Peak hours: 6PM-9PM • Weekend rates may apply</small>
            <small>Slot duration: {slotDuration} minutes</small>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}
