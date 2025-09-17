import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Layout } from './components/common/Layout';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import Dashboard from './pages/Dashboard';
// import PanelMap from './pages/PanelMap/PanelMap';
// import PanelList from './pages/PanelList/PanelList';
import Analytics from './pages/Analytics';
import History from './pages/History';
// import Settings from './pages/Settings/Settings';
// import PanelDetails from './pages/PanelDetails/PanelDetails';
import NotFound from './pages/NotFound';
import BatteryDetails from './pages/BatteryDetails';
import SystemHealthDiagnostics from './pages/SystemHealthDiagnostics';
import MaintenanceManagement from './pages/Maintenance/MaintenanceManagement';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeContextProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="history" element={<History />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="battery" element={<BatteryDetails />} />
                <Route path="diagnostics" element={<SystemHealthDiagnostics />} />
                <Route path="maintenance" element={<MaintenanceManagement />} />
                {/* <Route path="settings" element={<Settings />} /> */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeContextProvider>
    </ErrorBoundary>
  );
};
