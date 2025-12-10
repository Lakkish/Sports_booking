import { Form } from "react-bootstrap";

export default function CoachSelector({ coaches, onSelect }) {
  return (
    <Form.Select
      onChange={(e) => {
        const coach = coaches.find((c) => c._id === e.target.value);
        onSelect(coach || null);
      }}
    >
      <option value="">No Coach</option>
      {coaches.map((coach) => (
        <option key={coach._id} value={coach._id}>
          {coach.name} (₹{coach.pricePerHour})
        </option>
      ))}
    </Form.Select>
  );
}
