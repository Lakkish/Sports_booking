import { Tab, Tabs, Container } from "react-bootstrap";
import AdminCourts from "../components/admin/AdminCourts";
import AdminEquipment from "../components/admin/AdminEquipment";
import AdminCoaches from "../components/admin/AdminCoaches";
import AdminPricingRules from "../components/admin/AdminPricingRules";

export default function AdminDashboard() {
  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>

      <Tabs defaultActiveKey="courts" className="mt-3">
        <Tab eventKey="courts" title="Courts">
          <AdminCourts />
        </Tab>
        <Tab eventKey="equipment" title="Equipment">
          <AdminEquipment />
        </Tab>
        <Tab eventKey="coaches" title="Coaches">
          <AdminCoaches />
        </Tab>
        <Tab eventKey="pricing" title="Pricing Rules">
          <AdminPricingRules />
        </Tab>
      </Tabs>
    </Container>
  );
}
