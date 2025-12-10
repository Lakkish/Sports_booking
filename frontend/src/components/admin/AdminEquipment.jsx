import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import api from "../../services/apiClient";
import { getEquipment } from "../../services/equipmentService";

export default function AdminEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEq, setNewEq] = useState({
    name: "",
    totalStock: 0,
    pricePerUnit: 0,
  });

  const loadEquipment = () => {
    getEquipment().then((res) => setEquipment(res.data));
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const handleCreate = async () => {
    await api.post("/equipment", newEq);
    setShowModal(false);
    loadEquipment();
  };

  return (
    <div className="mt-3">
      <Button onClick={() => setShowModal(true)}>Add Equipment</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Stock</th>
            <th>Price/Unit</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((eq) => (
            <tr key={eq._id}>
              <td>{eq.name}</td>
              <td>{eq.totalStock}</td>
              <td>₹{eq.pricePerUnit}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setNewEq({ ...newEq, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Total Stock</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) =>
                  setNewEq({ ...newEq, totalStock: Number(e.target.value) })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) =>
                  setNewEq({ ...newEq, pricePerUnit: Number(e.target.value) })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleCreate}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
