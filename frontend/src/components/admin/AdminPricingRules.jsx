import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import api from "../../services/apiClient";
import { getPricingRules } from "../../services/pricingService";

export default function AdminPricingRules() {
  const [rules, setRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    type: "flat",
    value: 0,
  });

  const loadRules = () => {
    getPricingRules().then((res) => setRules(res.data));
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleCreate = async () => {
    await api.post("/pricing-rules", newRule);
    setShowModal(false);
    loadRules();
  };

  const toggleStatus = async (id) => {
    await api.patch(`/pricing-rules/${id}/status`);
    loadRules();
  };

  return (
    <div className="mt-3">
      <Button onClick={() => setShowModal(true)}>Add Pricing Rule</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule._id}>
              <td>{rule.name}</td>
              <td>{rule.type}</td>
              <td>{rule.value}</td>
              <td>
                <Button size="sm" onClick={() => toggleStatus(rule._id)}>
                  {rule.isActive ? "Disable" : "Enable"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Pricing Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) =>
                  setNewRule({ ...newRule, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Type</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setNewRule({ ...newRule, type: e.target.value })
                }
              >
                <option value="flat">Flat Fee</option>
                <option value="multiplier">Multiplier</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) =>
                  setNewRule({ ...newRule, value: Number(e.target.value) })
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
