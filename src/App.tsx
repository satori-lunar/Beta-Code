import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HealthDashboard from './pages/HealthDashboard';
import Habits from './pages/Habits';
import Nutrition from './pages/Nutrition';
import WeightLog from './pages/WeightLog';
import Journal from './pages/Journal';
import Goals from './pages/Goals';
import Pathways from './pages/Pathways';
import PathwayDetail from './pages/PathwayDetail';
import Calendar from './pages/Calendar';
import Classes from './pages/Classes';
import Settings from './pages/Settings';
import Badges from './pages/Badges';
import AdminDashboard from './pages/AdminDashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Layout />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              >
                <Route index element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                <Route path="health" element={<ErrorBoundary><HealthDashboard /></ErrorBoundary>} />
                <Route path="habits" element={<ErrorBoundary><Habits /></ErrorBoundary>} />
                <Route path="nutrition" element={<ErrorBoundary><Nutrition /></ErrorBoundary>} />
                <Route path="weight" element={<ErrorBoundary><WeightLog /></ErrorBoundary>} />
                <Route path="journal" element={<ErrorBoundary><Journal /></ErrorBoundary>} />
                <Route path="goals" element={<ErrorBoundary><Goals /></ErrorBoundary>} />
                <Route path="pathways" element={<ErrorBoundary><Pathways /></ErrorBoundary>} />
                <Route path="pathways/:id" element={<ErrorBoundary><PathwayDetail /></ErrorBoundary>} />
                <Route path="calendar" element={<ErrorBoundary><Calendar /></ErrorBoundary>} />
                <Route path="classes" element={<ErrorBoundary><Classes /></ErrorBoundary>} />
                <Route path="settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
                <Route path="badges" element={<ErrorBoundary><Badges /></ErrorBoundary>} />
                <Route path="admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
