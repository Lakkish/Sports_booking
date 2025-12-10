import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { getUserBookings } from "../services/bookingService";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get logged in user
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setMessage("You must be logged in to view booking history.");
      setLoading(false);
      return;
    }

    getUserBookings(user.id)
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setMessage("Failed to load booking history.");
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner animation="border" className="m-3" />;

  if (message) return <Alert variant="danger">{message}</Alert>;

  return (
    <Container className="mt-4">
      <h3>Your Booking History</h3>

      {bookings.length === 0 && <p>No bookings found.</p>}

      <Row className="mt-3">
        {bookings.map((booking) => (
          <Col md={6} key={booking._id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>
                  {booking.court?.name} ({booking.court?.type?.toUpperCase()})
                </Card.Title>

                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(booking.startTime).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {new Date(booking.endTime).toLocaleString()}
                </p>

                <p>
                  <strong>Status:</strong> {booking.status}
                </p>

                {booking.coach && (
                  <p>
                    <strong>Coach:</strong> {booking.coach.name}
                  </p>
                )}

                {booking.equipment?.length > 0 && (
                  <div>
                    <strong>Equipment:</strong>
                    <ul>
                      {booking.equipment.map((item) => (
                        <li key={item._id}>
                          {item.equipmentId?.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <hr />

                <h5>Total Price: ₹{booking.pricingBreakdown?.total}</h5>

                <details>
                  <summary style={{ cursor: "pointer" }}>
                    View breakdown
                  </summary>
                  <p>Base Price: ₹{booking.pricingBreakdown?.basePrice}</p>
                  <p>
                    Indoor Premium: ₹{booking.pricingBreakdown?.indoorPremium}
                  </p>
                  <p>Peak Fee: ₹{booking.pricingBreakdown?.peakFee}</p>
                  <p>Weekend Fee: ₹{booking.pricingBreakdown?.weekendFee}</p>
                  <p>
                    Equipment Fee: ₹{booking.pricingBreakdown?.equipmentFee}
                  </p>
                  <p>Coach Fee: ₹{booking.pricingBreakdown?.coachFee}</p>
                </details>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
