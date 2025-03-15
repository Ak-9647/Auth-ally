import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Tools from './pages/Tools';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import CoverGeneratorPage from './pages/CoverGenerator';
import Goals from './pages/Goals';
import Collaboration from './pages/Collaboration';
import Export from './pages/Export';

// Layout components will be imported here once created

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes wrapped in MainLayout for consistent navigation */}
        <Route element={<MainLayout><Dashboard /></MainLayout>} path="/" />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        {/* Protected routes */}
        <Route path="/editor/:id?" element={
          <RequireAuth>
            <MainLayout>
              <Editor />
            </MainLayout>
          </RequireAuth>
        } />
        <Route path="/goals" element={
          <RequireAuth>
            <MainLayout>
              <Goals />
            </MainLayout>
          </RequireAuth>
        } />
        <Route path="/collaboration" element={
          <RequireAuth>
            <MainLayout>
              <Collaboration />
            </MainLayout>
          </RequireAuth>
        } />
        <Route path="/export" element={
          <RequireAuth>
            <MainLayout>
              <Export />
            </MainLayout>
          </RequireAuth>
        } />
        <Route path="/tools" element={
          <RequireAuth>
            <MainLayout>
              <Tools />
            </MainLayout>
          </RequireAuth>
        } />
        <Route path="/tools/cover-generator" element={
          <RequireAuth>
            <MainLayout>
              <CoverGeneratorPage />
            </MainLayout>
          </RequireAuth>
        } />
        <Route path="/settings" element={
          <RequireAuth>
            <MainLayout>
              <Settings />
            </MainLayout>
          </RequireAuth>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
