import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import LandingPage from './pages/public/LandingPage';
import MapViewPage from './pages/public/MapViewPage';
import Login from './pages/admin/Login';
import ManageData from './pages/admin/ManageData';
import UserManagement from './pages/admin/UserManagement';
import ActivityLogs from './pages/admin/ActivityLogs';

const useAuth = () => {
  const token = localStorage.getItem('accessToken');
  return { isAuthenticated: !!token };
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated } = useAuth();
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/admin/manage" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="map" element={<MapViewPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/manage" replace />} />
          <Route path="manage" element={<ManageData />} />
          <Route path="map" element={<MapViewPage />} />
          
          <Route 
            path="users" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="logs" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <ActivityLogs />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
