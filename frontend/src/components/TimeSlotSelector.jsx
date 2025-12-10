import { Form } from "react-bootstrap";

export default function TimeSlotSelector({ onSelect }) {
  const timeSlots = [
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  const handleSelect = (e) => {
    const start = e.target.value;
    const end = `${String(Number(start.split(":")[0]) + 1).padStart(
      2,
      "0"
    )}:00`;
    onSelect({ start: `2025-12-12T${start}:00`, end: `2025-12-12T${end}:00` });
  };

  return (
    <Form.Select onChange={handleSelect}>
      <option>Select a time</option>
      {timeSlots.map((t) => (
        <option key={t} value={t}>
          {t} - {String(Number(t.split(":")[0]) + 1).padStart(2, "0")}:00
        </option>
      ))}
    </Form.Select>
  );
}
