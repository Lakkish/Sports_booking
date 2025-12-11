import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Nav,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import {
  FaTachometerAlt,
  FaCalendar,
  FaUsers,
  FaRupeeSign,
  FaChartLine,
  FaCogs,
  FaUserTie,
  FaTools,
} from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import * as adminService from "../../services/adminService";
import AdminCourts from "../../components/admin/AdminCourts";
import AdminCoaches from "../../components/admin/AdminCoaches";
import AdminEquipment from "../../components/admin/AdminEquipment";
import AdminPricingRules from "../../components/admin/AdminPricingRules";

export default function AdminDashboard() {
  const { get, isLoading, error } = useApi();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState(null);

  // Load dashboard stats when tab is active
  useState(() => {
    if (activeTab === "dashboard") {
      loadDashboardStats();
    }
  }, [activeTab]);

  const loadDashboardStats = async () => {
    try {
      const stats = await get(adminService.getDashboardStats);
      setDashboardStats(stats);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    }
  };

  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading dashboard...</p>
        </div>
      );
    }

    if (!dashboardStats) {
      return (
        <Alert variant="warning">
          Unable to load dashboard statistics. Please try again.
        </Alert>
      );
    }

    return (
      <div>
        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="text-white bg-primary h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title">Total Revenue</h6>
                    <h3 className="mb-0">
                      ₹{dashboardStats.revenue?.total || 0}
                    </h3>
                  </div>
                  <FaRupeeSign size={40} opacity={0.8} />
                </div>
                <small className="opacity-75">
                  This month: ₹{dashboardStats.revenue?.monthly || 0}
                </small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-white bg-success h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title">Total Bookings</h6>
                    <h3 className="mb-0">
                      {dashboardStats.bookings?.total || 0}
                    </h3>
                  </div>
                  <FaCalendar size={40} opacity={0.8} />
                </div>
                <small className="opacity-75">
                  Today: {dashboardStats.bookings?.today || 0}
                </small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-white bg-info h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title">Active Users</h6>
                    <h3 className="mb-0">{dashboardStats.users?.total || 0}</h3>
                  </div>
                  <FaUsers size={40} opacity={0.8} />
                </div>
                <small className="opacity-75">
                  New this month: {dashboardStats.users?.monthlyGrowth || 0}
                </small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-white bg-warning h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title">Utilization Rate</h6>
                    <h3 className="mb-0">
                      {dashboardStats.utilization?.rate || 0}%
                    </h3>
                  </div>
                  <FaChartLine size={40} opacity={0.8} />
                </div>
                <small className="opacity-75">
                  Peak hours: {dashboardStats.utilization?.peak || 0}%
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Quick Actions</h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <Button
                  variant="outline-primary"
                  className="w-100 h-100 py-3"
                  onClick={() => setActiveTab("courts")}
                >
                  <FaCogs size={24} className="mb-2" />
                  <div>Manage Courts</div>
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-success"
                  className="w-100 h-100 py-3"
                  onClick={() => setActiveTab("coaches")}
                >
                  <FaUserTie size={24} className="mb-2" />
                  <div>Manage Coaches</div>
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-info"
                  className="w-100 h-100 py-3"
                  onClick={() => setActiveTab("equipment")}
                >
                  <FaTools size={24} className="mb-2" />
                  <div>Manage Equipment</div>
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-warning"
                  className="w-100 h-100 py-3"
                  onClick={() => setActiveTab("pricing")}
                >
                  <FaRupeeSign size={24} className="mb-2" />
                  <div>Manage Pricing</div>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Bookings</h5>
              </Card.Header>
              <Card.Body>
                {dashboardStats.recentBookings?.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {dashboardStats.recentBookings
                      .slice(0, 5)
                      .map((booking) => (
                        <div key={booking._id} className="list-group-item">
                          <div className="d-flex justify-content-between">
                            <div>
                              <strong>{booking.court?.name}</strong>
                              <div className="small text-muted">
                                {new Date(
                                  booking.startTime
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-end">
                              <div>₹{booking.pricingBreakdown?.total || 0}</div>
                              <small
                                className={`badge bg-${
                                  booking.status === "confirmed"
                                    ? "success"
                                    : "danger"
                                }`}
                              >
                                {booking.status}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted text-center">No recent bookings</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">System Status</h5>
              </Card.Header>
              <Card.Body>
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Active Courts</span>
                    <span className="badge bg-primary">
                      {dashboardStats.courts?.active || 0}/
                      {dashboardStats.courts?.total || 0}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Active Coaches</span>
                    <span className="badge bg-success">
                      {dashboardStats.coaches?.active || 0}/
                      {dashboardStats.coaches?.total || 0}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Equipment Availability</span>
                    <span className="badge bg-info">
                      {dashboardStats.equipment?.available || 0}%
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Active Pricing Rules</span>
                    <span className="badge bg-warning">
                      {dashboardStats.pricingRules?.active || 0}
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h1 className="display-6 fw-bold text-primary">Admin Dashboard</h1>
        <p className="lead text-muted">Manage your sports booking system</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={3}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaTachometerAlt className="me-2" />
                  Navigation
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="dashboard"
                      className="border-bottom rounded-0"
                    >
                      <FaTachometerAlt className="me-2" />
                      Dashboard
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="courts"
                      className="border-bottom rounded-0"
                    >
                      <FaCogs className="me-2" />
                      Courts Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="coaches"
                      className="border-bottom rounded-0"
                    >
                      <FaUserTie className="me-2" />
                      Coaches Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="equipment"
                      className="border-bottom rounded-0"
                    >
                      <FaTools className="me-2" />
                      Equipment Management
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="pricing" className="rounded-0">
                      <FaRupeeSign className="me-2" />
                      Pricing Rules
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>

            {/* System Info */}
            <Card className="shadow-sm">
              <Card.Body>
                <h6>System Information</h6>
                <small className="text-muted d-block mb-2">
                  Last updated: {new Date().toLocaleDateString()}
                </small>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="w-100"
                  onClick={loadDashboardStats}
                >
                  Refresh Data
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">{renderDashboard()}</Tab.Pane>
              <Tab.Pane eventKey="courts">
                <AdminCourts />
              </Tab.Pane>
              <Tab.Pane eventKey="coaches">
                <AdminCoaches />
              </Tab.Pane>
              <Tab.Pane eventKey="equipment">
                <AdminEquipment />
              </Tab.Pane>
              <Tab.Pane eventKey="pricing">
                <AdminPricingRules />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}
