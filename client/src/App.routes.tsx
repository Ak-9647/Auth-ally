import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/editor/:id?" element={<Editor />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/cover-generator" element={<CoverGeneratorPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
