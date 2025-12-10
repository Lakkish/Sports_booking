import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
import BookingHistory from "./pages/BookingHistory";
import AdminDashboard from "./pages/AdminDashboard";
import NavbarComponent from "./components/NavbarComponent";

export default function App() {
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/history" element={<BookingHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
