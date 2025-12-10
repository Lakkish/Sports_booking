import { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { getCourts } from "../services/courtService";
import { BookingContext } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [courts, setCourts] = useState([]);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");

  const { setSelectedCourt, setSelectedTime } = useContext(BookingContext);
  const navigate = useNavigate();

  // Load courts on page load
  useEffect(() => {
    getCourts()
      .then((res) => setCourts(res.data))
      .catch(() => setMessage("Failed to load courts."));
  }, []);

  const handleBook = (court) => {
    if (!date) {
      setMessage("Please select a date before booking.");
      return;
    }

    // Save selected court and reset time slot
    setSelectedCourt(court);
    setSelectedTime({}); // clear time

    navigate("/book");
  };

  return (
    <Container className="mt-4">
      <h2>Book a Court</h2>

      {message && <Alert variant="warning">{message}</Alert>}

      <Form.Group className="mb-4" style={{ maxWidth: "250px" }}>
        <Form.Label>Select Date</Form.Label>
        <Form.Control type="date" onChange={(e) => setDate(e.target.value)} />
      </Form.Group>

      <Row>
        {courts.map((court) => (
          <Col md={4} key={court._id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{court.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {court.type.toUpperCase()}
                </Card.Subtitle>

                <p>Base Price: ₹{court.basePrice}</p>

                <Button variant="primary" onClick={() => handleBook(court)}>
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {courts.length === 0 && <p>No courts available.</p>}
    </Container>
  );
}
