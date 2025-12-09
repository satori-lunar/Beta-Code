import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Nutrition from './pages/Nutrition';
import WeightLog from './pages/WeightLog';
import Journal from './pages/Journal';
import Courses from './pages/Courses';
import Calendar from './pages/Calendar';
import Classes from './pages/Classes';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="habits" element={<Habits />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="weight" element={<WeightLog />} />
          <Route path="journal" element={<Journal />} />
          <Route path="courses" element={<Courses />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="classes" element={<Classes />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
