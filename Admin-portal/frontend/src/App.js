import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApplicationModal from './components/ApplicationModal/ApplicationModal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/applications/:id" element={<ApplicationModal />} />
      </Routes>
    </Router>
  );
}

export default App;
