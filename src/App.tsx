import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Layout } from './components/common/Layout';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import History from './pages/History';
import NotFound from './pages/NotFound';
import BatteryDetails from './pages/BatteryDetails';
import SystemHealthDiagnostics from './pages/SystemHealthDiagnostics';
import MaintenanceManagement from './pages/Maintenance/MaintenanceManagement';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/Login';

import './utils/axiosConfig';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeContextProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >

                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="history" element={<History />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="battery" element={<BatteryDetails />} />
                  <Route path="diagnostics" element={<SystemHealthDiagnostics />} />
                  <Route path="maintenance" element={<MaintenanceManagement />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </LocalizationProvider>
        </ThemeContextProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};
