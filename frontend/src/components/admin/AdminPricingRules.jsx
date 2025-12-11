import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
  Badge,
  Card,
  InputGroup,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaPercent,
  FaMoneyBill,
} from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import * as pricingService from "../../services/pricingService";

export default function AdminPricingRules() {
  const { get, post, patch, isLoading, error, clearError } = useApi();

  const [rules, setRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [selectedRule, setSelectedRule] = useState(null);

  const [ruleData, setRuleData] = useState({
    name: "",
    description: "",
    type: "flat",
    value: 0,
    appliesTo: "all",
    condition: "",
    isActive: true,
  });

  useEffect(() => {
    loadRules();
  }, []);

  useEffect(() => {
    filterRules();
  }, [rules, searchTerm]);

  const loadRules = async () => {
    try {
      const data = await get(pricingService.getPricingRules, false);
      setRules(data);
    } catch (err) {
      // Error handled by useApi
    }
  };

  const filterRules = () => {
    if (!searchTerm.trim()) {
      setFilteredRules(rules);
      return;
    }

    const filtered = rules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.appliesTo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredRules(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setRuleData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setRuleData({
      name: "",
      description: "",
      type: "flat",
      value: 0,
      appliesTo: "all",
      condition: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (rule) => {
    setModalMode("edit");
    setSelectedRule(rule);
    setRuleData({
      name: rule.name,
      description: rule.description || "",
      type: rule.type,
      value: rule.value,
      appliesTo: rule.appliesTo || "all",
      condition: rule.condition || "",
      isActive: rule.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === "create") {
        await post(pricingService.createPricingRule, ruleData);
      } else {
        await pricingService.updatePricingRule(selectedRule._id, ruleData);
      }

      setShowModal(false);
      loadRules();
      clearError();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const handleToggleStatus = async (ruleId) => {
    try {
      await patch(pricingService.togglePricingRuleStatus, ruleId);
      loadRules();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const handleDelete = async (ruleId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this pricing rule? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await pricingService.deletePricingRule(ruleId);
      loadRules();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const getTypeBadge = (type) => {
    if (type === "flat") {
      return (
        <Badge bg="primary">
          <FaMoneyBill className="me-1" />
          Flat Fee
        </Badge>
      );
    } else {
      return (
        <Badge bg="info">
          <FaPercent className="me-1" />
          Multiplier
        </Badge>
      );
    }
  };

  const getStatusBadge = (isActive) => (
    <Badge bg={isActive ? "success" : "danger"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  const getAppliesToBadge = (appliesTo) => {
    const variants = {
      all: "secondary",
      indoor: "info",
      outdoor: "success",
      weekend: "warning",
      peak: "danger",
      coach: "primary",
      equipment: "dark",
    };

    return (
      <Badge
        bg={variants[appliesTo] || "secondary"}
        className="text-capitalize"
      >
        {appliesTo}
      </Badge>
    );
  };

  const formatValue = (type, value) => {
    if (type === "flat") {
      return `₹${value}`;
    } else {
      return `${value}%`;
    }
  };

  if (isLoading && rules.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading pricing rules...</p>
      </div>
    );
  }

  return (
    <div>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaMoneyBill className="me-2" />
            <h5 className="mb-0">Manage Pricing Rules</h5>
          </div>
          <Button variant="light" size="sm" onClick={openCreateModal}>
            <FaPlus className="me-2" />
            Add New Rule
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between mb-4">
            <div className="w-50">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search rules by name, description, or applies to..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="d-flex gap-2">
              <Button
                variant={searchTerm ? "outline-primary" : "outline-secondary"}
                onClick={() => setSearchTerm("")}
                disabled={!searchTerm}
              >
                Clear Search
              </Button>
              <Button variant="primary" onClick={loadRules}>
                Refresh
              </Button>
            </div>
          </div>

          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={clearError}
              className="mb-4"
            >
              {error}
            </Alert>
          )}

          {filteredRules.length === 0 ? (
            <Alert variant="info" className="text-center">
              {searchTerm
                ? "No rules found matching your search."
                : "No pricing rules available. Add your first rule!"}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Rule Name</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Applies To</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule) => (
                    <tr key={rule._id}>
                      <td>
                        <div>
                          <strong>{rule.name}</strong>
                          {rule.description && (
                            <small className="d-block text-muted">
                              {rule.description}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>{getTypeBadge(rule.type)}</td>
                      <td className="fw-bold">
                        <span
                          className={
                            rule.type === "flat" ? "text-success" : "text-info"
                          }
                        >
                          {formatValue(rule.type, rule.value)}
                        </span>
                      </td>
                      <td>{getAppliesToBadge(rule.appliesTo)}</td>
                      <td>
                        {rule.condition ? (
                          <code className="small">{rule.condition}</code>
                        ) : (
                          <span className="text-muted">Always</span>
                        )}
                      </td>
                      <td>{getStatusBadge(rule.isActive)}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(rule)}
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant={
                              rule.isActive
                                ? "outline-warning"
                                : "outline-success"
                            }
                            size="sm"
                            onClick={() => handleToggleStatus(rule._id)}
                            title={rule.isActive ? "Deactivate" : "Activate"}
                          >
                            {rule.isActive ? <FaToggleOff /> : <FaToggleOn />}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(rule._id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="text-muted d-flex justify-content-between">
          <div>
            <small>
              Showing {filteredRules.length} of {rules.length} rules
            </small>
            <div className="d-flex gap-2 mt-1">
              <Badge bg="success">
                Active: {rules.filter((r) => r.isActive).length}
              </Badge>
              <Badge bg="danger">
                Inactive: {rules.filter((r) => !r.isActive).length}
              </Badge>
              <Badge bg="primary">
                Flat Fees: {rules.filter((r) => r.type === "flat").length}
              </Badge>
              <Badge bg="info">
                Multipliers:{" "}
                {rules.filter((r) => r.type === "multiplier").length}
              </Badge>
            </div>
          </div>
          <small>Last updated: {new Date().toLocaleTimeString()}</small>
        </Card.Footer>
      </Card>

      {/* Pricing Rule Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modalMode === "create"
              ? "Add New Pricing Rule"
              : "Edit Pricing Rule"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={clearError}
              className="mb-3"
            >
              {error}
            </Alert>
          )}

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rule Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={ruleData.name}
                    onChange={handleInputChange}
                    placeholder="Enter rule name"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rule Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={ruleData.type}
                    onChange={handleInputChange}
                  >
                    <option value="flat">Flat Fee</option>
                    <option value="multiplier">Percentage Multiplier</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={ruleData.description}
                onChange={handleInputChange}
                rows={2}
                placeholder="Enter rule description (optional)"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {ruleData.type === "flat"
                      ? "Fee Amount (₹)"
                      : "Percentage (%)"}{" "}
                    *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="value"
                    value={ruleData.value}
                    onChange={handleInputChange}
                    min="0"
                    step={ruleData.type === "flat" ? "10" : "0.1"}
                    required
                  />
                  <Form.Text className="text-muted">
                    {ruleData.type === "flat"
                      ? "Fixed amount to add"
                      : "Percentage to multiply (e.g., 10 = 10% increase)"}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Applies To *</Form.Label>
                  <Form.Select
                    name="appliesTo"
                    value={ruleData.appliesTo}
                    onChange={handleInputChange}
                  >
                    <option value="all">All Bookings</option>
                    <option value="indoor">Indoor Courts Only</option>
                    <option value="outdoor">Outdoor Courts Only</option>
                    <option value="weekend">Weekend Bookings</option>
                    <option value="peak">Peak Hours (6PM-9PM)</option>
                    <option value="coach">Bookings with Coach</option>
                    <option value="equipment">Bookings with Equipment</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Condition (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="condition"
                value={ruleData.condition}
                onChange={handleInputChange}
                placeholder="e.g., duration > 2, equipment_count >= 3"
              />
              <Form.Text className="text-muted">
                JavaScript condition for when this rule applies (leave empty for
                always)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                name="isActive"
                label="Rule is active and will be applied"
                checked={ruleData.isActive}
                onChange={(e) =>
                  setRuleData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!ruleData.name || ruleData.value < 0}
          >
            {modalMode === "create" ? "Add Rule" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
