import { Form } from "react-bootstrap";

export default function EquipmentSelector({ equipment, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {equipment.name} (₹{equipment.pricePerUnit})
      </Form.Label>
      <Form.Control
        type="number"
        min="0"
        max={equipment.totalStock}
        onChange={(e) => onChange(equipment, Number(e.target.value))}
      />
    </Form.Group>
  );
}
