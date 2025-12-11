import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaRupeeSign, FaUsers } from "react-icons/fa";
import * as useBooking from "../../hooks/useBooking";
import * as useApi from "../../hooks/useApi";
import * as courtService from "../../services/courtService";

import {
  formatPrice,
  getTodayDate,
  getTomorrowDate,
} from "../../utils/dateUtils";

export default function Home() {
  const navigate = useNavigate();
  const { setSelectedCourt, setSelectedTime } = useBooking();
  const { get, isLoading, error } = useApi();

  const [courts, setCourts] = useState([]);
  const [date, setDate] = useState(getTodayDate());
  const [filter, setFilter] = useState("all"); // all, indoor, outdoor
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    try {
      const data = await get(courtService.getCourts, true);
      setCourts(data);
    } catch (err) {
      setMessage("Failed to load courts. Please try again.");
    }
  };

  const filteredCourts = courts.filter((court) => {
    if (filter === "all") return true;
    return court.type === filter;
  });

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = getTodayDate();

    if (selectedDate < today) {
      setMessage("Cannot select past dates");
      return;
    }

    setDate(selectedDate);
    setMessage("");
  };

  const handleBookCourt = (court) => {
    if (!date) {
      setMessage("Please select a date first");
      return;
    }

    // Set selected court and reset time
    setSelectedCourt(court);
    setSelectedTime({});

    // Navigate to booking page with date as state
    navigate("/book", { state: { selectedDate: date } });
  };

  const getCourtBadge = (court) => {
    if (!court.isActive) {
      return (
        <Badge bg="danger" className="ms-2">
          Unavailable
        </Badge>
      );
    }
    if (court.type === "indoor") {
      return (
        <Badge bg="info" className="ms-2">
          Indoor
        </Badge>
      );
    }
    return (
      <Badge bg="success" className="ms-2">
        Outdoor
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading courts...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold text-primary">Book Your Court</h1>
        <p className="lead text-muted">
          Select a date and choose from our premium sports facilities
        </p>
      </div>

      {message && (
        <Alert
          variant="warning"
          dismissible
          onClose={() => setMessage("")}
          className="mb-4"
        >
          {message}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Date Selection */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <div className="d-flex align-items-center">
                <FaCalendarAlt className="text-primary me-2" size={20} />
                <h5 className="mb-0">Select Date</h5>
              </div>
            </Col>
            <Col md={4}>
              <Form.Control
                type="date"
                value={date}
                onChange={handleDateChange}
                min={getTodayDate()}
                className="border-primary"
              />
            </Col>
            <Col md={4} className="text-md-end">
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setDate(getTodayDate())}
                >
                  Today
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setDate(getTomorrowDate())}
                >
                  Tomorrow
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Court Filter */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Available Courts</h4>
        <div className="btn-group" role="group">
          <Button
            variant={filter === "all" ? "primary" : "outline-primary"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All Courts
          </Button>
          <Button
            variant={filter === "indoor" ? "primary" : "outline-primary"}
            onClick={() => setFilter("indoor")}
            size="sm"
          >
            Indoor
          </Button>
          <Button
            variant={filter === "outdoor" ? "primary" : "outline-primary"}
            onClick={() => setFilter("outdoor")}
            size="sm"
          >
            Outdoor
          </Button>
        </div>
      </div>

      {/* Courts Grid */}
      {filteredCourts.length === 0 ? (
        <Alert variant="info" className="text-center">
          No courts available for the selected filter.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredCourts.map((court) => (
            <Col key={court._id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title className="mb-0">
                      {court.name}
                      {getCourtBadge(court)}
                    </Card.Title>
                  </div>

                  <Card.Text className="text-muted mb-3">
                    {court.type === "indoor"
                      ? "Climate-controlled indoor facility"
                      : "Open-air outdoor facility"}
                  </Card.Text>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <FaRupeeSign className="text-success me-1" />
                        <span className="h5 mb-0">
                          {formatPrice(court.basePrice)}
                        </span>
                        <small className="text-muted ms-1">/hour</small>
                      </div>

                      {court.maxPlayers && (
                        <div className="d-flex align-items-center">
                          <FaUsers className="text-info me-1" />
                          <small>Up to {court.maxPlayers} players</small>
                        </div>
                      )}
                    </div>

                    <Button
                      variant={court.isActive ? "primary" : "secondary"}
                      onClick={() => handleBookCourt(court)}
                      disabled={!court.isActive || !date}
                      className="w-100"
                    >
                      {court.isActive ? "Book Now" : "Unavailable"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Quick Stats */}
      {courts.length > 0 && (
        <Card className="mt-5 bg-light border-0">
          <Card.Body>
            <Row>
              <Col md={4} className="text-center">
                <h3 className="text-primary">{courts.length}</h3>
                <p className="text-muted mb-0">Total Courts</p>
              </Col>
              <Col md={4} className="text-center">
                <h3 className="text-primary">
                  {courts.filter((c) => c.type === "indoor").length}
                </h3>
                <p className="text-muted mb-0">Indoor Courts</p>
              </Col>
              <Col md={4} className="text-center">
                <h3 className="text-primary">
                  {courts.filter((c) => c.isActive).length}
                </h3>
                <p className="text-muted mb-0">Available Now</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
