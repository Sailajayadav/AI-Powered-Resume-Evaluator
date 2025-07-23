import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ApplicationSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5 text-center">
      <CheckCircle size={64} className="text-success mb-3" />
      <h4>Application Submitted!</h4>
      <p>You've successfully completed your application and MCQ test.</p>
      <button className="btn btn-success" onClick={() => navigate('/')}>Back to Jobs</button>
    </div>
  );
};

export default ApplicationSuccessPage;
