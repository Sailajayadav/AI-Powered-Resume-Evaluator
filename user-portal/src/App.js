import React from "react";
import JobPortal from "./components/JobPortal";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // ✅ Import Router components
import JobDetails from './components/JobDetails';   
import ApplyPage from "./components/ApplyPage";
import MCQTestPage from './components/MCQTestPage';
import ApplicationSuccessPage from './components/ApplicationSuccessPage';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<JobPortal />} />
      <Route path="/job/:jobId" element={<JobDetails />} />
      <Route path="/apply/:jobId" element={<ApplyPage />} />
      <Route path="/mcq-test/:jobId/:applicantId" element={<MCQTestPage />} />
      <Route path="/application-success/:jobId" element={<ApplicationSuccessPage />} />
    </Routes>
  </Router>
  );
}

export default App;
