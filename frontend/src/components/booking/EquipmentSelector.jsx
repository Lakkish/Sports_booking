import { useState } from "react";
import {
  Card,
  Button,
  Badge,
  InputGroup,
  Form,
  Row,
  Col,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import {
  FaTools,
  FaShoppingCart,
  FaRupeeSign,
  FaPlus,
  FaMinus,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";
import { formatPrice } from "../../utils/dateUtils";

export default function EquipmentSelector({
  equipment = [],
  selectedEquipment = [],
  onChange,
  showOnlyAvailable = true,
  maxQuantityPerItem = 10,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quantities, setQuantities] = useState({});

  // Get unique categories
  const categories = [
    "all",
    ...new Set(equipment.map((item) => item.category).filter(Boolean)),
  ];

  // Filter equipment
  const filteredEquipment = equipment.filter((item) => {
    // Filter by availability
    if (showOnlyAvailable && (!item.isAvailable || item.totalStock <= 0)) {
      return false;
    }

    // Filter by category
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Get current quantity for an equipment item
  const getCurrentQuantity = (equipmentId) => {
    const selected = selectedEquipment.find(
      (item) => item.equipmentId === equipmentId
    );
    return selected ? selected.quantity : 0;
  };

  // Handle quantity change
  const handleQuantityChange = (item, newQuantity) => {
    newQuantity = Math.max(
      0,
      Math.min(newQuantity, Math.min(maxQuantityPerItem, item.totalStock))
    );

    setQuantities((prev) => ({
      ...prev,
      [item._id]: newQuantity,
    }));

    onChange(item, newQuantity);
  };

  // Increment quantity
  const incrementQuantity = (item) => {
    const currentQty = getCurrentQuantity(item._id);
    handleQuantityChange(item, currentQty + 1);
  };

  // Decrement quantity
  const decrementQuantity = (item) => {
    const currentQty = getCurrentQuantity(item._id);
    handleQuantityChange(item, currentQty - 1);
  };

  // Get stock badge
  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <Badge bg="danger">
          <FaExclamationTriangle className="me-1" />
          Out of Stock
        </Badge>
      );
    } else if (stock <= 3) {
      return <Badge bg="warning">Low Stock ({stock})</Badge>;
    } else if (stock <= 10) {
      return <Badge bg="info">In Stock ({stock})</Badge>;
    } else {
      return <Badge bg="success">Available ({stock})</Badge>;
    }
  };

  // Get stock progress bar
  const getStockProgress = (stock) => {
    const maxStock = 20; // For visualization purposes
    const percentage = Math.min((stock / maxStock) * 100, 100);
    let variant = "success";

    if (stock === 0) variant = "danger";
    else if (stock <= 3) variant = "warning";
    else if (stock <= 10) variant = "info";

    return (
      <div className="d-flex align-items-center">
        <ProgressBar
          variant={variant}
          now={percentage}
          style={{ width: "60px", height: "6px" }}
          className="me-2"
        />
        <small>{stock} units</small>
      </div>
    );
  };

  // Calculate total equipment price
  const calculateTotalPrice = () => {
    return selectedEquipment.reduce((total, selected) => {
      const item = equipment.find((e) => e._id === selected.equipmentId);
      return total + selected.quantity * (item?.pricePerUnit || 0);
    }, 0);
  };

  return (
    <div className="equipment-selector">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <FaTools className="me-2 text-primary" />
          Select Equipment
        </h5>

        {selectedEquipment.length > 0 && (
          <div className="d-flex align-items-center">
            <Badge bg="primary" className="me-2">
              {selectedEquipment.length} item
              {selectedEquipment.length !== 1 ? "s" : ""}
            </Badge>
            <span className="text-success fw-bold">
              <FaRupeeSign /> {formatPrice(calculateTotalPrice())}
            </span>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="mb-4">
        <Row className="g-2">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search equipment by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Selected Equipment Summary */}
      {selectedEquipment.length > 0 && (
        <Alert variant="light" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Selected Equipment:</strong>
              <div className="mt-2">
                {selectedEquipment.map((selected) => {
                  const item = equipment.find(
                    (e) => e._id === selected.equipmentId
                  );
                  if (!item) return null;

                  return (
                    <Badge
                      key={item._id}
                      bg="light"
                      text="dark"
                      className="me-2 mb-1"
                    >
                      {item.name} × {selected.quantity}
                      <FaRupeeSign className="ms-1" />{" "}
                      {formatPrice(selected.quantity * item.pricePerUnit)}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {
                selectedEquipment.forEach((selected) => {
                  const item = equipment.find(
                    (e) => e._id === selected.equipmentId
                  );
                  if (item) onChange(item, 0);
                });
              }}
            >
              Clear All
            </Button>
          </div>
        </Alert>
      )}

      {/* Equipment List */}
      {filteredEquipment.length === 0 ? (
        <Alert variant="info" className="text-center">
          <FaTools className="me-2" />
          {searchTerm
            ? "No equipment found matching your search."
            : "No equipment available."}
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-3">
          {filteredEquipment.map((item) => {
            const currentQty = getCurrentQuantity(item._id);
            const isOutOfStock = item.totalStock === 0;

            return (
              <Col key={item._id}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <Card.Title className="h6 mb-1">
                          {item.name}
                          {item.category && (
                            <Badge bg="secondary" className="ms-2">
                              {item.category}
                            </Badge>
                          )}
                        </Card.Title>
                        <div className="small text-muted">
                          {item.description && (
                            <div className="mb-1">{item.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="text-success h6 mb-0">
                          <FaRupeeSign /> {formatPrice(item.pricePerUnit)}
                        </div>
                        <small className="text-muted">per unit</small>
                      </div>
                    </div>

                    {/* Stock Information */}
                    <div className="mb-3">
                      {getStockBadge(item.totalStock)}
                      {getStockProgress(item.totalStock)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => decrementQuantity(item)}
                          disabled={currentQty <= 0 || isOutOfStock}
                          className="rounded-circle"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <FaMinus />
                        </Button>

                        <div
                          className="mx-3 text-center"
                          style={{ minWidth: "40px" }}
                        >
                          <span className="h5 mb-0">{currentQty}</span>
                        </div>

                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => incrementQuantity(item)}
                          disabled={
                            currentQty >=
                              Math.min(maxQuantityPerItem, item.totalStock) ||
                            isOutOfStock
                          }
                          className="rounded-circle"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <FaPlus />
                        </Button>
                      </div>

                      <div className="text-end">
                        {currentQty > 0 && (
                          <div className="text-success">
                            <small>Total: </small>
                            <strong>
                              <FaRupeeSign />{" "}
                              {formatPrice(currentQty * item.pricePerUnit)}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Summary Footer */}
      <div className="mt-4 p-3 bg-light rounded">
        <Row className="align-items-center">
          <Col md={6}>
            <div className="d-flex align-items-center">
              <FaShoppingCart className="text-primary me-2" />
              <div>
                <div className="small text-muted">Selected Items</div>
                <div className="h5 mb-0">{selectedEquipment.length}</div>
              </div>
            </div>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="d-flex flex-column">
              <div className="small text-muted">Estimated Equipment Cost</div>
              <div className="h4 text-success mb-0">
                <FaRupeeSign /> {formatPrice(calculateTotalPrice())}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
