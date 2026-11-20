import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./AdminDashboard";
import FarmerDashboard from "./FarmerDashboard";

import { AuthProvider, useAuth } from "./context/AuthContext";

// Protect dashboards according to the user's role
function ProtectedRoute({ allowedRole, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/farmer/dashboard"}
        replace
      />
    );
  }

  return children;
}

// Application routes
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          
            <Login />
          
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Protected dashboard routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute allowedRole="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Development preview routes */}
      <Route path="/admin/dashboard-preview" element={<AdminDashboard />} />

      <Route path="/farmer/dashboard-preview" element={<FarmerDashboard />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// AuthProvider must wrap every component that uses useAuth()
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
