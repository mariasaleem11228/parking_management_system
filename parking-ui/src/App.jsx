import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Auth pages
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Layouts
import AdminLayout   from './layouts/AdminLayout';
import CitizenLayout from './layouts/CitizenLayout';

// Admin pages
import AdminDashboard  from './pages/admin/Dashboard';
import ZonesPage       from './pages/admin/ZonesPage';
import SpacesPage      from './pages/admin/SpacesPage';
import PricingPage     from './pages/admin/PricingPage';
import UsersPage       from './pages/admin/UsersPage';
import ReservationsAdmin from './pages/admin/ReservationsAdmin';
import BillingAdmin    from './pages/admin/BillingAdmin';

// Citizen pages
import CitizenHome     from './pages/citizen/CitizenHome';
import ParkingMap      from './pages/citizen/ParkingMap';
import MyReservations  from './pages/citizen/MyReservations';
import MyBilling       from './pages/citizen/MyBilling';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh' }}><span className="spinner" /></div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'ADMIN'
    ? <Navigate to="/admin"   replace />
    : <Navigate to="/citizen" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/"         element={<RootRedirect />} />

            {/* Admin */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index               element={<AdminDashboard />} />
              <Route path="zones"        element={<ZonesPage />} />
              <Route path="spaces"       element={<SpacesPage />} />
              <Route path="pricing"      element={<PricingPage />} />
              <Route path="users"        element={<UsersPage />} />
              <Route path="reservations" element={<ReservationsAdmin />} />
              <Route path="billing"      element={<BillingAdmin />} />
            </Route>

            {/* Citizen */}
            <Route path="/citizen" element={
              <ProtectedRoute requiredRole="CITIZEN">
                <CitizenLayout />
              </ProtectedRoute>
            }>
              <Route index                element={<CitizenHome />} />
              <Route path="map"           element={<ParkingMap />} />
              <Route path="reservations"  element={<MyReservations />} />
              <Route path="billing"       element={<MyBilling />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
