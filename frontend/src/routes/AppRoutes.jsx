import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Pages
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import LookupPage from '../pages/LookupPage';
import LiveCamerasPage from '../pages/LiveCamerasPage';
import AlertsPage from '../pages/AlertsPage';
import HistoryPage from '../pages/HistoryPage';
import MediaViewPage from '../pages/MediaViewPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route path="/app/lookup" element={<ProtectedRoute><LookupPage /></ProtectedRoute>} />
      <Route path="/app/live" element={<ProtectedRoute><LiveCamerasPage /></ProtectedRoute>} />
      <Route path="/app/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path="/app/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

      {/* Public media viewer - no auth needed, just a direct fullscreen output view */}
      <Route path="/media-view" element={<MediaViewPage />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
