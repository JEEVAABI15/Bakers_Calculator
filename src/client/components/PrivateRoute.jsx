import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function PrivateRoute() {
  return authAPI.isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}
