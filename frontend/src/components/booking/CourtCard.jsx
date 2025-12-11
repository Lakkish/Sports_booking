import { Card, Button, Badge, Row, Col } from "react-bootstrap";
import { FaUsers, FaRupeeSign, FaCheckCircle } from "react-icons/fa";
import { formatPrice } from "../../utils/dateUtils";

export default function CourtCard({
  court,
  onSelect,
  isSelected = false,
  showDetails = true,
  compact = false,
}) {
  const getCourtIcon = (type) => {
    switch (type) {
      case "indoor":
        return "🏠";
      case "outdoor":
        return "☀️";
      default:
        return "🎾";
    }
  };

  const getTypeBadge = (type) => {
    const variants = {
      indoor: { bg: "info", text: "Indoor" },
      outdoor: { bg: "success", text: "Outdoor" },
    };
    const variant = variants[type] || { bg: "secondary", text: type };

    return (
      <Badge bg={variant.bg} className="text-uppercase">
        {variant.text}
      </Badge>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge bg="success" className="ms-2">
        Available
      </Badge>
    ) : (
      <Badge bg="danger" className="ms-2">
        Unavailable
      </Badge>
    );
  };

  if (compact) {
    return (
      <Card
        className={`h-100 border-${isSelected ? "primary" : "light"} shadow-sm`}
      >
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "1.5rem" }}>
                  {getCourtIcon(court.type)}
                </span>
                <h6 className="mb-0">{court.name}</h6>
                {getTypeBadge(court.type)}
              </div>
              <div className="d-flex align-items-center gap-2 mt-2">
                <small className="text-success fw-bold">
                  <FaRupeeSign /> {formatPrice(court.basePrice)}/hr
                </small>
                {court.maxPlayers && (
                  <small className="text-muted">
                    <FaUsers className="me-1" />
                    {court.maxPlayers} players
                  </small>
                )}
              </div>
            </div>
            <Button
              variant={isSelected ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => onSelect(court)}
              disabled={!court.isActive}
            >
              {isSelected ? <FaCheckCircle /> : "Select"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      className={`h-100 border-${
        isSelected ? "primary border-3" : "light"
      } shadow-sm hover-card`}
    >
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title className="mb-1">
              {court.name}
              {getStatusBadge(court.isActive)}
            </Card.Title>
            <div className="d-flex align-items-center gap-2 mb-2">
              {getTypeBadge(court.type)}
              {court.maxPlayers && (
                <Badge bg="secondary">
                  <FaUsers className="me-1" />
                  {court.maxPlayers} max
                </Badge>
              )}
            </div>
          </div>
          <div style={{ fontSize: "2rem" }}>{getCourtIcon(court.type)}</div>
        </div>

        {showDetails && court.description && (
          <Card.Text className="text-muted mb-3 small">
            {court.description}
          </Card.Text>
        )}

        <div className="mt-auto">
          <Row className="mb-3">
            <Col xs={6}>
              <div className="d-flex align-items-center text-success">
                <FaRupeeSign className="me-1" />
                <div>
                  <strong className="h5 mb-0">
                    {formatPrice(court.basePrice)}
                  </strong>
                  <div className="small text-muted">per hour</div>
                </div>
              </div>
            </Col>
            {court.dimensions && (
              <Col xs={6}>
                <div className="small text-muted">
                  <div>Size: {court.dimensions}</div>
                </div>
              </Col>
            )}
          </Row>

          <Button
            variant={isSelected ? "success" : "primary"}
            onClick={() => onSelect(court)}
            disabled={!court.isActive}
            className="w-100"
            size="lg"
          >
            {isSelected ? (
              <>
                <FaCheckCircle className="me-2" />
                Selected
              </>
            ) : (
              "Select Court"
            )}
          </Button>

          {!court.isActive && (
            <div className="text-center mt-2">
              <small className="text-danger">
                This court is currently unavailable for booking
              </small>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
