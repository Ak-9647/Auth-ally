import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';

// Pages
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Tools from './pages/Tools';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import CoverGeneratorPage from './pages/CoverGenerator';

// Layout components will be imported here once created

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        {/* Protected routes */}
        <Route path="/editor/:id?" element={
          <RequireAuth>
            <Editor />
          </RequireAuth>
        } />
        <Route path="/tools" element={
          <RequireAuth>
            <Tools />
          </RequireAuth>
        } />
        <Route path="/tools/cover-generator" element={
          <RequireAuth>
            <CoverGeneratorPage />
          </RequireAuth>
        } />
        <Route path="/settings" element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
