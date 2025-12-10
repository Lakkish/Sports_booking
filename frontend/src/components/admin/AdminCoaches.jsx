import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import api from "../../services/apiClient";
import { getCoaches } from "../../services/coachService";

export default function AdminCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCoach, setNewCoach] = useState({
    name: "",
    pricePerHour: 0,
  });

  const loadCoaches = () => {
    getCoaches().then((res) => setCoaches(res.data));
  };

  useEffect(() => {
    loadCoaches();
  }, []);

  const handleCreate = async () => {
    await api.post("/coaches", newCoach);
    setShowModal(false);
    loadCoaches();
  };

  return (
    <div className="mt-3">
      <Button onClick={() => setShowModal(true)}>Add Coach</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price/Hour</th>
          </tr>
        </thead>
        <tbody>
          {coaches.map((coach) => (
            <tr key={coach._id}>
              <td>{coach.name}</td>
              <td>₹{coach.pricePerHour}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Coach</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) =>
                  setNewCoach({ ...newCoach, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Price Per Hour</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) =>
                  setNewCoach({
                    ...newCoach,
                    pricePerHour: Number(e.target.value),
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
