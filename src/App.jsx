import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { InventoryManagement } from './components/InventoryManagement.jsx';
import { ProductManagement } from './components/ProductManagement.jsx';
import { BillingSystem } from './components/BillingSystem.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Profile from './components/Profile.jsx';

function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

function logout() {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={
            isAuthenticated() ? (
              <Layout>
                <Profile onLogout={logout} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/inventory"
          element={
            isAuthenticated() ? (
              <Layout>
                <InventoryManagement />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/products"
          element={
            isAuthenticated() ? (
              <Layout>
                <ProductManagement />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/billing"
          element={
            isAuthenticated() ? (
              <Layout>
                <BillingSystem />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App; 