import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Bases from './pages/Bases';
import Equipment from './pages/Equipment';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';
import Reports from './pages/Reports';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected with Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/bases" element={
            <ProtectedRoute>
              <Layout>
                <Bases />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/equipment" element={
            <ProtectedRoute>
              <Layout>
                <Equipment />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/purchases" element={
            <ProtectedRoute>
              <Layout>
                <Purchases />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/transfers" element={
            <ProtectedRoute>
              <Layout>
                <Transfers />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/assignments" element={
            <ProtectedRoute>
              <Layout>
                <Assignments />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Default */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
