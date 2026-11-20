import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./AdminDashboard";
import FarmerDashboard from "./FarmerDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Development preview only. Replace with a backend-protected route
            when authentication is implemented. Never deploy this route open. */}
        <Route path="/admin/dashboard-preview" element={<AdminDashboard />} />
        <Route path="/farmer/dashboard-preview" element={<FarmerDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
