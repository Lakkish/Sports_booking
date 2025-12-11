import { useState } from "react";
import {
  Form,
  Card,
  Button,
  Badge,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import {
  FaUserTie,
  FaStar,
  FaRupeeSign,
  FaInfoCircle,
  FaCheck,
} from "react-icons/fa";
import { formatPrice } from "../../utils/dateUtils";

export default function CoachSelector({
  coaches = [],
  selectedCoach = null,
  onSelect,
  showOnlyAvailable = true,
  allowClear = true,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter coaches based on availability and search
  const filteredCoaches = coaches
    .filter((coach) => {
      if (showOnlyAvailable && !coach.isActive) return false;
      if (!searchTerm.trim()) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        coach.name.toLowerCase().includes(searchLower) ||
        coach.specialization?.toLowerCase().includes(searchLower) ||
        coach.email?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.pricePerHour - b.pricePerHour;
        case "price-desc":
          return b.pricePerHour - a.pricePerHour;
        case "experience":
          return (b.experience || 0) - (a.experience || 0);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getExperienceStars = (experience) => {
    if (!experience) return null;

    const stars = Math.min(Math.floor(experience / 2), 5); // Max 5 stars
    return (
      <div className="d-flex align-items-center">
        {[...Array(stars)].map((_, i) => (
          <FaStar key={i} className="text-warning me-1" size={12} />
        ))}
        <small className="text-muted ms-1">({experience} yrs)</small>
      </div>
    );
  };

  const handleCoachSelect = (coach) => {
    if (selectedCoach?._id === coach._id && allowClear) {
      onSelect(null); // Deselect if already selected
    } else {
      onSelect(coach);
    }
  };

  return (
    <div className="coach-selector">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <FaUserTie className="me-2 text-primary" />
          Select a Coach (Optional)
        </h5>

        {selectedCoach && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onSelect(null)}
          >
            Remove Coach
          </Button>
        )}
      </div>

      <div className="mb-4">
        <Row className="g-2">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text>
                <FaUserTie />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search coaches by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="experience">Experience</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {selectedCoach && (
        <Alert variant="success" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Selected Coach: {selectedCoach.name}</strong>
              <div className="small">
                {selectedCoach.specialization && (
                  <Badge bg="info" className="me-2">
                    {selectedCoach.specialization}
                  </Badge>
                )}
                <span className="text-success fw-bold">
                  <FaRupeeSign /> {formatPrice(selectedCoach.pricePerHour)}/hour
                </span>
              </div>
            </div>
            <FaCheck size={24} className="text-success" />
          </div>
        </Alert>
      )}

      {filteredCoaches.length === 0 ? (
        <Alert variant="info" className="text-center">
          <FaInfoCircle className="me-2" />
          {searchTerm
            ? "No coaches found matching your search."
            : "No coaches available."}
        </Alert>
      ) : (
        <Row xs={1} md={2} className="g-3">
          {filteredCoaches.map((coach) => (
            <Col key={coach._id}>
              <Card
                className={`h-100 cursor-pointer ${
                  selectedCoach?._id === coach._id
                    ? "border-primary border-3"
                    : ""
                }`}
                onClick={() => handleCoachSelect(coach)}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <Card.Title className="mb-1">
                        {coach.name}
                        {!coach.isActive && (
                          <Badge bg="danger" className="ms-2">
                            Unavailable
                          </Badge>
                        )}
                      </Card.Title>
                      {coach.specialization && (
                        <Badge bg="info" className="text-uppercase">
                          {coach.specialization}
                        </Badge>
                      )}
                    </div>
                    <div className="text-end">
                      <div className="text-success h5 mb-0">
                        <FaRupeeSign /> {formatPrice(coach.pricePerHour)}
                      </div>
                      <small className="text-muted">per hour</small>
                    </div>
                  </div>

                  {coach.experience && (
                    <div className="mb-2">
                      {getExperienceStars(coach.experience)}
                    </div>
                  )}

                  {coach.bio && (
                    <Card.Text className="text-muted small mb-3">
                      {coach.bio.length > 100
                        ? `${coach.bio.substring(0, 100)}...`
                        : coach.bio}
                    </Card.Text>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="small">
                      {coach.email && (
                        <div className="text-truncate">{coach.email}</div>
                      )}
                      {coach.phone && (
                        <div className="text-muted">{coach.phone}</div>
                      )}
                    </div>

                    <Button
                      variant={
                        selectedCoach?._id === coach._id
                          ? "success"
                          : "outline-primary"
                      }
                      size="sm"
                      disabled={!coach.isActive}
                    >
                      {selectedCoach?._id === coach._id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div className="mt-3 text-center">
        <small className="text-muted">
          {filteredCoaches.length} coach
          {filteredCoaches.length !== 1 ? "es" : ""} available
        </small>
      </div>
    </div>
  );
}
