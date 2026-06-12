import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Common protection
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Doctors from './pages/public/Doctors';
import Reserve from './pages/public/Reserve';

// Auth pages
import Login from './pages/auth/Login';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import ManageServices from './pages/admin/ManageServices';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManagePayments from './pages/admin/ManagePayments';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageMessages from './pages/admin/ManageMessages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="reserve" element={<Reserve />} />
          </Route>

          {/* Authenticated Admin Entrance */}
          <Route path="/login" element={<Login />} />

          {/* Admin Panels (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="doctors" element={<ManageDoctors />} />
            <Route path="appointments" element={<ManageAppointments />} />
            <Route path="payments" element={<ManagePayments />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="messages" element={<ManageMessages />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
