import { Card, Button } from "react-bootstrap";

export default function CourtCard({ court, onSelect }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{court.name}</Card.Title>
        <Card.Subtitle>{court.type.toUpperCase()}</Card.Subtitle>
        <Button className="mt-2" onClick={() => onSelect(court)}>
          Select Court
        </Button>
      </Card.Body>
    </Card>
  );
}
