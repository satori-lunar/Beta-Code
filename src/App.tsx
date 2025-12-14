import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HealthDashboard from './pages/HealthDashboard';
import Habits from './pages/Habits';
import Nutrition from './pages/Nutrition';
import WeightLog from './pages/WeightLog';
import Journal from './pages/Journal';
import Courses from './pages/Courses';
import Calendar from './pages/Calendar';
import Classes from './pages/Classes';
import Settings from './pages/Settings';
import Badges from './pages/Badges';
import AdminDashboard from './pages/AdminDashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="health" element={<HealthDashboard />} />
              <Route path="habits" element={<Habits />} />
              <Route path="nutrition" element={<Nutrition />} />
              <Route path="weight" element={<WeightLog />} />
              <Route path="journal" element={<Journal />} />
              <Route path="courses" element={<Courses />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="classes" element={<Classes />} />
              <Route path="settings" element={<Settings />} />
              <Route path="badges" element={<Badges />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
