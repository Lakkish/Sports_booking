import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Button,
  Badge,
  Dropdown,
  Form,
} from "react-bootstrap";
import {
  FaCalendar,
  FaRupeeSign,
  FaUserTie,
  FaTools,
  FaFilter,
  FaSort,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useApi } from "../../hooks/useApi";
import * as bookingService from "../../services/bookingService";
import {
  formatPrice,
  formatTimeSlot,
  formatDateToInput,
} from "../../utils/dateUtils";

export default function BookingHistory() {
  const { getUserId } = useAuth();
  const { get, isLoading, error } = useApi();

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filter, setFilter] = useState("all"); // all, upcoming, past, cancelled
  const [sortBy, setSortBy] = useState("date-desc");
  const [searchDate, setSearchDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filter, sortBy, searchDate]);

  const loadBookings = async () => {
    try {
      const userId = getUserId();
      const data = await get(bookingService.getUserBookings, userId);
      setBookings(data);
    } catch (err) {
      setMessage("Failed to load booking history.");
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((booking) => {
        const now = new Date();
        const startTime = new Date(booking.startTime);

        if (filter === "upcoming")
          return startTime > now && booking.status === "confirmed";
        if (filter === "past")
          return startTime <= now && booking.status === "confirmed";
        if (filter === "cancelled") return booking.status === "cancelled";
        return true;
      });
    }

    // Apply date filter
    if (searchDate) {
      filtered = filtered.filter((booking) => {
        const bookingDate = formatDateToInput(new Date(booking.startTime));
        return bookingDate === searchDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.startTime);
      const dateB = new Date(b.startTime);

      switch (sortBy) {
        case "date-asc":
          return dateA - dateB;
        case "date-desc":
          return dateB - dateA;
        case "price-asc":
          return (
            (a.pricingBreakdown?.total || 0) - (b.pricingBreakdown?.total || 0)
          );
        case "price-desc":
          return (
            (b.pricingBreakdown?.total || 0) - (a.pricingBreakdown?.total || 0)
          );
        default:
          return dateB - dateA;
      }
    });

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await bookingService.cancelBooking(bookingId);
      setMessage("Booking cancelled successfully.");
      loadBookings(); // Refresh list
    } catch (err) {
      setMessage("Failed to cancel booking.");
    }
  };

  const getStatusBadge = (status, startTime) => {
    const now = new Date();
    const start = new Date(startTime);

    if (status === "cancelled") return <Badge bg="danger">Cancelled</Badge>;
    if (status === "confirmed" && start > now)
      return <Badge bg="success">Upcoming</Badge>;
    if (status === "confirmed" && start <= now)
      return <Badge bg="info">Completed</Badge>;
    return <Badge bg="secondary">{status}</Badge>;
  };

  const getCardVariant = (status) => {
    switch (status) {
      case "cancelled":
        return "danger";
      case "confirmed":
        return "success";
      default:
        return "light";
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your bookings...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="display-6 fw-bold text-primary">Booking History</h1>
        <p className="lead text-muted">View and manage all your bookings</p>
      </div>

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
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Filters and Controls */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <div className="d-flex align-items-center">
                <FaFilter className="text-primary me-2" />
                <h6 className="mb-0">Filter</h6>
              </div>
              <div className="btn-group w-100 mt-2">
                {["all", "upcoming", "past", "cancelled"].map((filterType) => (
                  <Button
                    key={filterType}
                    variant={
                      filter === filterType ? "primary" : "outline-primary"
                    }
                    onClick={() => setFilter(filterType)}
                    size="sm"
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </Button>
                ))}
              </div>
            </Col>

            <Col md={3}>
              <div className="d-flex align-items-center">
                <FaSort className="text-primary me-2" />
                <h6 className="mb-0">Sort By</h6>
              </div>
              <Form.Select
                size="sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-2"
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="price-asc">Price (Low to High)</option>
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="small">Search by Date</Form.Label>
                <Form.Control
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  size="sm"
                />
              </Form.Group>
            </Col>

            <Col md={3} className="text-end">
              <Button
                variant="outline-primary"
                onClick={() => setSearchDate("")}
                size="sm"
                className="me-2"
              >
                Clear Filters
              </Button>
              <Button variant="primary" onClick={loadBookings} size="sm">
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bookings Count */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>
          Showing {filteredBookings.length} of {bookings.length} bookings
        </h5>
        <div className="d-flex gap-2">
          <Badge bg="success" className="px-3 py-2">
            Upcoming:{" "}
            {
              bookings.filter(
                (b) =>
                  b.status === "confirmed" && new Date(b.startTime) > new Date()
              ).length
            }
          </Badge>
          <Badge bg="info" className="px-3 py-2">
            Completed:{" "}
            {
              bookings.filter(
                (b) =>
                  b.status === "confirmed" &&
                  new Date(b.startTime) <= new Date()
              ).length
            }
          </Badge>
          <Badge bg="danger" className="px-3 py-2">
            Cancelled: {bookings.filter((b) => b.status === "cancelled").length}
          </Badge>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Alert variant="info" className="text-center">
          {searchDate
            ? "No bookings found for the selected date."
            : "No bookings found."}
        </Alert>
      ) : (
        <Row xs={1} lg={2} className="g-4">
          {filteredBookings.map((booking) => (
            <Col key={booking._id}>
              <Card
                className={`h-100 shadow-sm border-${getCardVariant(
                  booking.status
                )}`}
              >
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FaCalendar className="me-2" />
                    <strong>
                      {new Date(booking.startTime).toLocaleDateString()}
                    </strong>
                  </div>
                  {getStatusBadge(booking.status, booking.startTime)}
                </Card.Header>

                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h5 className="text-primary">{booking.court?.name}</h5>
                      <Badge bg="secondary" className="mb-2">
                        {booking.court?.type?.toUpperCase()}
                      </Badge>

                      <div className="mt-3">
                        <h6>
                          <FaCalendar className="me-2 text-muted" />
                          Time Slot
                        </h6>
                        <p className="mb-2">
                          {formatTimeSlot(booking.startTime, booking.endTime)}
                        </p>

                        {booking.coach && (
                          <>
                            <h6>
                              <FaUserTie className="me-2 text-muted" />
                              Coach
                            </h6>
                            <p className="mb-2">{booking.coach.name}</p>
                          </>
                        )}
                      </div>
                    </Col>

                    <Col md={6}>
                      <h6 className="text-muted">Equipment</h6>
                      {booking.equipment?.length > 0 ? (
                        <ul className="list-unstyled">
                          {booking.equipment.map((item) => (
                            <li
                              key={item._id}
                              className="d-flex justify-content-between"
                            >
                              <span>{item.equipmentId?.name}</span>
                              <span>× {item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No equipment</p>
                      )}
                    </Col>
                  </Row>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="text-success">
                        <FaRupeeSign className="me-1" />
                        {formatPrice(booking.pricingBreakdown?.total || 0)}
                      </h5>
                      <small className="text-muted">Total Amount</small>
                    </div>

                    <div className="text-end">
                      <small className="d-block text-muted">
                        Booked on:{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </small>

                      {booking.status === "confirmed" &&
                        new Date(booking.startTime) > new Date() && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            className="mt-2"
                          >
                            Cancel Booking
                          </Button>
                        )}
                    </div>
                  </div>

                  {/* Price Breakdown Accordion */}
                  <details className="mt-3">
                    <summary
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                    >
                      View Price Breakdown
                    </summary>
                    <div className="mt-2 p-3 bg-light rounded">
                      <Row>
                        <Col>
                          <p className="mb-1">
                            Base Price:{" "}
                            {formatPrice(
                              booking.pricingBreakdown?.basePrice || 0
                            )}
                          </p>
                          <p className="mb-1">
                            Indoor Premium:{" "}
                            {formatPrice(
                              booking.pricingBreakdown?.indoorPremium || 0
                            )}
                          </p>
                          <p className="mb-1">
                            Peak Fee:{" "}
                            {formatPrice(
                              booking.pricingBreakdown?.peakFee || 0
                            )}
                          </p>
                        </Col>
                        <Col>
                          <p className="mb-1">
                            Weekend Fee:{" "}
                            {formatPrice(
                              booking.pricingBreakdown?.weekendFee || 0
                            )}
                          </p>
                          <p className="mb-1">
                            Equipment Fee:{" "}
                            {formatPrice(
                              booking.pricingBreakdown?.equipmentFee || 0
                            )}
                          </p>
                          <p className="mb-1">
                            Coach Fee:{" "}
                            {formatPrice(
                              booking.pricingBreakdown?.coachFee || 0
                            )}
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </details>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
