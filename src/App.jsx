import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import './styles/index.css';

import CitizenDashboard from './pages/Citizen/Dashboard';
import ReportIssue from './pages/Citizen/ReportIssue';
import OfficialDashboard from './pages/Official/Dashboard';

import './styles/index.css';

// Mock Protected Route Component (Simplified for prototype)
const ProtectedRoute = ({ children }) => {
  // In real app, check auth status here
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="screen-container">
          <Routes>
            <Route path="/auth" element={<Auth />} />

            {/* Citizen Routes */}
            <Route path="/citizen/dashboard" element={
              <ProtectedRoute><CitizenDashboard /></ProtectedRoute>
            } />
            <Route path="/citizen/report" element={
              <ProtectedRoute><ReportIssue /></ProtectedRoute>
            } />

            {/* Official Routes */}
            <Route path="/official/dashboard" element={
              <ProtectedRoute><OfficialDashboard /></ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
