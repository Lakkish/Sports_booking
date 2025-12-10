import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { getCourts } from "../../services/courtService";
import api from "../../services/apiClient";

export default function AdminCourts() {
  const [courts, setCourts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCourt, setNewCourt] = useState({
    name: "",
    type: "indoor",
    basePrice: 0,
  });

  const loadCourts = () => {
    getCourts().then((res) => setCourts(res.data));
  };

  useEffect(() => {
    loadCourts();
  }, []);

  const handleCreate = async () => {
    await api.post("/courts", newCourt);
    setShowModal(false);
    loadCourts();
  };

  const toggleStatus = async (id) => {
    await api.patch(`/courts/${id}/status`);
    loadCourts();
  };

  return (
    <div className="mt-3">
      <Button onClick={() => setShowModal(true)}>Add Court</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Base Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courts.map((court) => (
            <tr key={court._id}>
              <td>{court.name}</td>
              <td>{court.type}</td>
              <td>₹{court.basePrice}</td>
              <td>{court.isActive ? "Active" : "Disabled"}</td>
              <td>
                <Button size="sm" onClick={() => toggleStatus(court._id)}>
                  Toggle Status
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Court</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) =>
                  setNewCourt({ ...newCourt, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Type</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setNewCourt({ ...newCourt, type: e.target.value })
                }
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Base Price</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) =>
                  setNewCourt({
                    ...newCourt,
                    basePrice: Number(e.target.value),
                  })
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
