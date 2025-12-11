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
  ProgressBar,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBox,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import * as equipmentService from "../../services/equipmentService";
import { formatPrice } from "../../utils/dateUtils";

export default function AdminEquipment() {
  const { get, post, patch, isLoading, error, clearError } = useApi();

  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState("create");
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [equipmentData, setEquipmentData] = useState({
    name: "",
    description: "",
    totalStock: 0,
    pricePerUnit: 0,
    category: "",
    isAvailable: true,
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [equipment, searchTerm]);

  const loadEquipment = async () => {
    try {
      const data = await get(equipmentService.getEquipment);
      setEquipment(data);
    } catch (err) {
      // Error handled by useApi
    }
  };

  const filterEquipment = () => {
    if (!searchTerm.trim()) {
      setFilteredEquipment(equipment);
      return;
    }

    const filtered = equipment.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredEquipment(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setEquipmentData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setEquipmentData({
      name: "",
      description: "",
      totalStock: 0,
      pricePerUnit: 0,
      category: "",
      isAvailable: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setSelectedEquipment(item);
    setEquipmentData({
      name: item.name,
      description: item.description || "",
      totalStock: item.totalStock,
      pricePerUnit: item.pricePerUnit,
      category: item.category || "",
      isAvailable: item.isAvailable !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === "create") {
        await post(equipmentService.createEquipment, equipmentData);
      } else {
        await equipmentService.updateEquipment(
          selectedEquipment._id,
          equipmentData
        );
      }

      setShowModal(false);
      loadEquipment();
      clearError();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const handleDelete = async (equipmentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this equipment? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await equipmentService.deleteEquipment(equipmentId);
      loadEquipment();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const handleUpdateStock = async (equipmentId, newStock) => {
    const currentStock =
      equipment.find((e) => e._id === equipmentId)?.totalStock || 0;
    const stockChange = newStock - currentStock;

    if (stockChange === 0) return;

    try {
      await equipmentService.updateEquipmentStock(equipmentId, newStock);
      loadEquipment();
    } catch (err) {
      // Error handled by useApi
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <Badge bg="danger">
          <FaExclamationTriangle className="me-1" />
          Out of Stock
        </Badge>
      );
    } else if (stock <= 5) {
      return <Badge bg="warning">Low Stock ({stock})</Badge>;
    } else if (stock <= 10) {
      return <Badge bg="info">Limited ({stock})</Badge>;
    } else {
      return <Badge bg="success">In Stock ({stock})</Badge>;
    }
  };

  const getStockProgress = (stock) => {
    // Assuming max reasonable stock is 50 for visualization
    const percentage = Math.min((stock / 50) * 100, 100);
    let variant = "success";

    if (stock === 0) variant = "danger";
    else if (stock <= 5) variant = "warning";
    else if (stock <= 10) variant = "info";

    return (
      <div className="d-flex align-items-center">
        <ProgressBar
          variant={variant}
          now={percentage}
          style={{ width: "80px", height: "8px" }}
          className="me-2"
        />
        <small>{stock} units</small>
      </div>
    );
  };

  if (isLoading && equipment.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading equipment...</p>
      </div>
    );
  }

  return (
    <div>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaBox className="me-2" />
            <h5 className="mb-0">Manage Equipment</h5>
          </div>
          <Button variant="light" size="sm" onClick={openCreateModal}>
            <FaPlus className="me-2" />
            Add New Equipment
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
                  placeholder="Search equipment by name, description, or category..."
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
              <Button variant="primary" onClick={loadEquipment}>
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

          {filteredEquipment.length === 0 ? (
            <Alert variant="info" className="text-center">
              {searchTerm
                ? "No equipment found matching your search."
                : "No equipment available. Add your first equipment!"}
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Equipment</th>
                    <th>Category</th>
                    <th>Stock Level</th>
                    <th>Price/Unit</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div>
                          <strong>{item.name}</strong>
                          {item.description && (
                            <small className="d-block text-muted">
                              {item.description}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        {item.category ? (
                          <Badge bg="secondary">{item.category}</Badge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          {getStockBadge(item.totalStock)}
                          {getStockProgress(item.totalStock)}
                          <small className="text-muted mt-1">
                            Last updated:{" "}
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </small>
                        </div>
                      </td>
                      <td className="text-success fw-bold">
                        {formatPrice(item.pricePerUnit)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEditModal(item)}
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => {
                              const newStock = prompt(
                                `Update stock for ${item.name}:`,
                                item.totalStock
                              );
                              if (newStock !== null && !isNaN(newStock)) {
                                handleUpdateStock(item._id, parseInt(newStock));
                              }
                            }}
                            title="Update Stock"
                          >
                            Stock
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(item._id)}
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
              Showing {filteredEquipment.length} of {equipment.length} items
            </small>
            <div className="d-flex gap-2 mt-1">
              <Badge bg="success">
                In Stock: {equipment.filter((e) => e.totalStock > 10).length}
              </Badge>
              <Badge bg="warning">
                Low Stock:{" "}
                {
                  equipment.filter(
                    (e) => e.totalStock > 0 && e.totalStock <= 10
                  ).length
                }
              </Badge>
              <Badge bg="danger">
                Out of Stock:{" "}
                {equipment.filter((e) => e.totalStock === 0).length}
              </Badge>
            </div>
          </div>
          <small>Last updated: {new Date().toLocaleTimeString()}</small>
        </Card.Footer>
      </Card>

      {/* Equipment Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modalMode === "create" ? "Add New Equipment" : "Edit Equipment"}
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
                  <Form.Label>Equipment Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={equipmentData.name}
                    onChange={handleInputChange}
                    placeholder="Enter equipment name"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={equipmentData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    <option value="sports">Sports Gear</option>
                    <option value="fitness">Fitness Equipment</option>
                    <option value="protective">Protective Gear</option>
                    <option value="accessories">Accessories</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={equipmentData.description}
                onChange={handleInputChange}
                rows={2}
                placeholder="Enter equipment description (optional)"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalStock"
                    value={equipmentData.totalStock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                  <Form.Text className="text-muted">
                    Total available units in inventory
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price per Unit (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="pricePerUnit"
                    value={equipmentData.pricePerUnit}
                    onChange={handleInputChange}
                    min="0"
                    step="10"
                    required
                  />
                  <Form.Text className="text-muted">
                    Rental price per unit per booking
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                name="isAvailable"
                label="Equipment is available for booking"
                checked={equipmentData.isAvailable}
                onChange={(e) =>
                  setEquipmentData((prev) => ({
                    ...prev,
                    isAvailable: e.target.checked,
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
            disabled={
              !equipmentData.name ||
              equipmentData.totalStock < 0 ||
              equipmentData.pricePerUnit < 0
            }
          >
            {modalMode === "create" ? "Add Equipment" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
