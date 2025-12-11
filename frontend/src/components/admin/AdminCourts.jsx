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
} from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import * as courtService from "../../services/courtService";
import { formatPrice } from "../../utils/dateUtils";

export default function AdminCourts() {
  const { get, post, patch, isLoading, error, clearError } = useApi();

  const [courts, setCourts] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedCourt, setSelectedCourt] = useState(null);

  const [courtData, setCourtData] = useState({
    name: "",
    type: "indoor",
    basePrice: 0,
    maxPlayers: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    loadCourts();
  }, []);

  useEffect(() => {
    filterCourts();
  }, [courts, searchTerm]);

  const loadCourts = async () => {
    try {
      const data = await get(courtService.getCourts, false); // Get all, not just active
      setCourts(data);
    } catch (err) {
      // Error handled by useApi
    }
  };

  const filterCourts = () => {
    if (!searchTerm.trim()) {
      setFilteredCourts(courts);
      return;
    }

    const filtered = courts.filter(
      (court) =>
        court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCourts(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setCourtData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCourtData({
      name: "",
      type: "indoor",
      basePrice: 0,
      maxPlayers: "",
      description: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (court) => {
    setModalMode("edit");
    setSelectedCourt(court);
    setCourtData({
      name: court.name,
      type: court.type,
      basePrice: court.basePrice,
      maxPlayers: court.maxPlayers || "",
      description: court.description || "",
      isActive: court.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...courtData,
        maxPlayers: courtData.maxPlayers
          ? parseInt(courtData.maxPlayers)
          : undefined,
      };

      if (modalMode === "create") {
        await post(courtService.createCourt, payload);
      } else {
        await courtService.updateCourt(selectedCourt._id, payload);
      }

      setShowModal(false);
      loadCourts();
      clearError();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const handleToggleStatus = async (courtId) => {
    try {
      await patch(courtService.toggleCourtStatus, courtId);
      loadCourts();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const handleDelete = async (courtId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this court? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await courtService.deleteCourt(courtId);
      loadCourts();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const getStatusBadge = (isActive) => (
    <Badge bg={isActive ? "success" : "danger"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  const getTypeBadge = (type) => (
    <Badge
      bg={type === "indoor" ? "info" : "success"}
      className="text-uppercase"
    >
      {type}
    </Badge>
  );

  if (isLoading && courts.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading courts...</p>
      </div>
    );
  }

  return (
    <div>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Manage Courts</h5>
          <Button variant="light" size="sm" onClick={openCreateModal}>
            <FaPlus className="me-2" />
            Add New Court
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
                  placeholder="Search courts by name, type, or description..."
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
              <Button variant="primary" onClick={loadCourts}>
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

          {filteredCourts.length === 0 ? (
            <Alert variant="info" className="text-center">
              {searchTerm
                ? "No courts found matching your search."
                : "No courts available. Add your first court!"}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Price/Hour</th>
                    <th>Max Players</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourts.map((court) => (
                    <tr key={court._id}>
                      <td>
                        <div>
                          <strong>{court.name}</strong>
                          {court.description && (
                            <small className="d-block text-muted">
                              {court.description}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>{getTypeBadge(court.type)}</td>
                      <td className="text-success fw-bold">
                        {formatPrice(court.basePrice)}
                      </td>
                      <td>
                        {court.maxPlayers ? (
                          <Badge bg="secondary">
                            {court.maxPlayers} players
                          </Badge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>{getStatusBadge(court.isActive)}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(court)}
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant={
                              court.isActive
                                ? "outline-warning"
                                : "outline-success"
                            }
                            size="sm"
                            onClick={() => handleToggleStatus(court._id)}
                            title={court.isActive ? "Deactivate" : "Activate"}
                          >
                            {court.isActive ? <FaToggleOff /> : <FaToggleOn />}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(court._id)}
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
          <small>
            Showing {filteredCourts.length} of {courts.length} courts
          </small>
          <small>Last updated: {new Date().toLocaleTimeString()}</small>
        </Card.Footer>
      </Card>

      {/* Court Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modalMode === "create" ? "Add New Court" : "Edit Court"}
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
                  <Form.Label>Court Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={courtData.name}
                    onChange={handleInputChange}
                    placeholder="Enter court name"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={courtData.type}
                    onChange={handleInputChange}
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price per Hour (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="basePrice"
                    value={courtData.basePrice}
                    onChange={handleInputChange}
                    min="0"
                    step="50"
                    required
                  />
                  <Form.Text className="text-muted">
                    Base price for 1 hour booking
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Maximum Players</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxPlayers"
                    value={courtData.maxPlayers}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    placeholder="Optional"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={courtData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter court description (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                name="isActive"
                label="Court is active and available for booking"
                checked={courtData.isActive}
                onChange={(e) =>
                  setCourtData((prev) => ({
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
            disabled={!courtData.name || !courtData.basePrice}
          >
            {modalMode === "create" ? "Create Court" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
