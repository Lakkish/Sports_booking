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
  FaUserTie,
} from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import * as coachService from "../../services/coachService";
import { formatPrice } from "../../utils/dateUtils";

export default function AdminCoaches() {
  const { get, post, patch, isLoading, error, clearError } = useApi();

  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [selectedCoach, setSelectedCoach] = useState(null);

  const [coachData, setCoachData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    pricePerHour: 0,
    bio: "",
    isActive: true,
  });

  useEffect(() => {
    loadCoaches();
  }, []);

  useEffect(() => {
    filterCoaches();
  }, [coaches, searchTerm]);

  const loadCoaches = async () => {
    try {
      const data = await get(coachService.getCoaches, false);
      setCoaches(data);
    } catch (err) {
      // Error handled by useApi
    }
  };

  const filterCoaches = () => {
    if (!searchTerm.trim()) {
      setFilteredCoaches(coaches);
      return;
    }

    const filtered = coaches.filter(
      (coach) =>
        coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCoaches(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setCoachData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setCoachData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      pricePerHour: 0,
      bio: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (coach) => {
    setModalMode("edit");
    setSelectedCoach(coach);
    setCoachData({
      name: coach.name,
      email: coach.email || "",
      phone: coach.phone || "",
      specialization: coach.specialization || "",
      experience: coach.experience || "",
      pricePerHour: coach.pricePerHour,
      bio: coach.bio || "",
      isActive: coach.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...coachData,
        experience: coachData.experience
          ? parseInt(coachData.experience)
          : undefined,
      };

      if (modalMode === "create") {
        await post(coachService.createCoach, payload);
      } else {
        await coachService.updateCoach(selectedCoach._id, payload);
      }

      setShowModal(false);
      loadCoaches();
      clearError();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const handleToggleStatus = async (coachId) => {
    try {
      await patch(coachService.toggleCoachStatus, coachId);
      loadCoaches();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const handleDelete = async (coachId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this coach? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await coachService.deleteCoach(coachId);
      loadCoaches();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const getStatusBadge = (isActive) => (
    <Badge bg={isActive ? "success" : "danger"}>
      {isActive ? "Available" : "Unavailable"}
    </Badge>
  );

  const getExperienceBadge = (experience) => {
    if (!experience) return null;

    let variant = "secondary";
    if (experience >= 10) variant = "success";
    else if (experience >= 5) variant = "primary";
    else if (experience >= 2) variant = "info";

    return (
      <Badge bg={variant} className="ms-2">
        {experience}+ years
      </Badge>
    );
  };

  if (isLoading && coaches.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading coaches...</p>
      </div>
    );
  }

  return (
    <div>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaUserTie className="me-2" />
            <h5 className="mb-0">Manage Coaches</h5>
          </div>
          <Button variant="light" size="sm" onClick={openCreateModal}>
            <FaPlus className="me-2" />
            Add New Coach
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
                  placeholder="Search coaches by name, email, or specialization..."
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
              <Button variant="primary" onClick={loadCoaches}>
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

          {filteredCoaches.length === 0 ? (
            <Alert variant="info" className="text-center">
              {searchTerm
                ? "No coaches found matching your search."
                : "No coaches available. Add your first coach!"}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Coach</th>
                    <th>Contact</th>
                    <th>Specialization</th>
                    <th>Price/Hour</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoaches.map((coach) => (
                    <tr key={coach._id}>
                      <td>
                        <div>
                          <strong>{coach.name}</strong>
                          {getExperienceBadge(coach.experience)}
                          {coach.bio && (
                            <small className="d-block text-muted">
                              {coach.bio}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          {coach.email && (
                            <div className="small">{coach.email}</div>
                          )}
                          {coach.phone && (
                            <div className="small">{coach.phone}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        {coach.specialization ? (
                          <Badge bg="info">{coach.specialization}</Badge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-success fw-bold">
                        {formatPrice(coach.pricePerHour)}
                      </td>
                      <td>{getStatusBadge(coach.isActive)}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(coach)}
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant={
                              coach.isActive
                                ? "outline-warning"
                                : "outline-success"
                            }
                            size="sm"
                            onClick={() => handleToggleStatus(coach._id)}
                            title={
                              coach.isActive
                                ? "Make Unavailable"
                                : "Make Available"
                            }
                          >
                            {coach.isActive ? <FaToggleOff /> : <FaToggleOn />}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(coach._id)}
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
            Showing {filteredCoaches.length} of {coaches.length} coaches
          </small>
          <small>Last updated: {new Date().toLocaleTimeString()}</small>
        </Card.Footer>
      </Card>

      {/* Coach Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modalMode === "create" ? "Add New Coach" : "Edit Coach"}
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
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={coachData.name}
                    onChange={handleInputChange}
                    placeholder="Enter coach's full name"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={coachData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={coachData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialization"
                    value={coachData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g., Tennis, Badminton, Fitness"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Years of Experience</Form.Label>
                  <Form.Control
                    type="number"
                    name="experience"
                    value={coachData.experience}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                    placeholder="Optional"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price per Hour (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="pricePerHour"
                    value={coachData.pricePerHour}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    required
                  />
                  <Form.Text className="text-muted">
                    Hourly rate for coaching
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Bio / Description</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={coachData.bio}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter coach bio or description (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                name="isActive"
                label="Coach is active and available for booking"
                checked={coachData.isActive}
                onChange={(e) =>
                  setCoachData((prev) => ({
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
            disabled={!coachData.name || !coachData.pricePerHour}
          >
            {modalMode === "create" ? "Add Coach" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
