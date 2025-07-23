import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


import { User, Mail, FileText, TrendingUp, Brain, Mic, MessageSquare, Award, ArrowLeft, Eye, EyeOff } from 'lucide-react';

// Utility function to get score interpretation
const getScoreInterpretation = (score, type) => {
  const interpretations = {
    match: {
      excellent: { min: 85, label: 'Excellent Match', variant: 'success' },
      good: { min: 70, label: 'Good Match', variant: 'primary' },
      moderate: { min: 50, label: 'Moderate Match', variant: 'warning' },
      poor: { min: 0, label: 'Poor Match', variant: 'danger' }
    },
    confidence: {
      high: { min: 75, label: 'High Confidence', variant: 'success' },
      moderate: { min: 50, label: 'Moderate Confidence', variant: 'warning' },
      low: { min: 0, label: 'Needs Improvement', variant: 'danger' }
    }
  };

  const ranges = interpretations[type];
  for (const [key, range] of Object.entries(ranges)) {
    if (score >= range.min) {
      return range;
    }
  }
  return ranges.poor || ranges.low;
};

// Enhanced Circular Progress Component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, showLabel = true, label = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (percent) => {
    if (percent >= 75) return '#28a745'; // bootstrap success
    if (percent >= 50) return '#ffc107'; // bootstrap warning
    return '#dc3545'; // bootstrap danger
  };

  return (
    <div className="d-inline-flex align-items-center justify-content-center position-relative">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e9ecef"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      <div className="position-absolute d-flex flex-column align-items-center justify-content-center">
        <span className="h4 fw-bold text-dark mb-0">{Math.round(percentage)}</span>
        {showLabel && label && <small className="text-muted text-center">{label}</small>}
      </div>
    </div>
  );
};

// Skill Tag Component
const SkillTag = ({ skill }) => (
  <span className="badge bg-primary me-2 mb-2 px-3 py-2 fs-6">
    {skill}
  </span>
);

// Role Confidence Tag Component
const RoleConfidenceTag = ({ role }) => (
  <div className="d-inline-flex align-items-center">
    <span className="badge bg-info px-3 py-2 fs-6">
      <Award size={16} className="me-2" />
      {role}
    </span>
  </div>
);



const ApplicationModal = () => {
  const [showResume, setShowResume] = useState(false);
  
  const location = useLocation();
  const application = location.state?.application;
  const navigate = useNavigate();

  if (!application) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="card shadow-lg" style={{ maxWidth: '28rem' }}>
          <div className="card-body text-center p-5">
            <div className="mx-auto d-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded-circle mb-4" style={{ width: '3rem', height: '3rem' }}>
              <FileText size={24} className="text-warning" />
            </div>
            <h3 className="card-title">No Application Data</h3>
            <p className="card-text text-muted mb-4">
              No application data found. Please return to the dashboard to select an application.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="me-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate overall insights
  const overallScore = application.match_score;
  const behavioralAvg = (
    (application.behavioral_score.facial.confidence + 
     application.behavioral_score.facial.engagement + 
     application.behavioral_score.voice.scores.confidence + 
     application.behavioral_score.voice.scores.clarity) / 4
  ) * 100;

  const sentimentScore = application.behavioral_score.text.sentiment.compound;
  const normalizedSentiment = ((sentimentScore + 1) / 2) * 100; // Convert from -1,1 to 0,100

  return (
    <div className="min-vh-100 bg-light">
      {/* Bootstrap CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <div className="row align-items-center py-4">
            <div className="col">
              <h1 className="h2 fw-bold text-dark mb-1">Application Analysis</h1>
              <p className="text-muted mb-0">Comprehensive candidate evaluation report</p>
            </div>
            <div className="col-auto">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-outline-secondary"
              >
                <ArrowLeft size={16} className="me-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        {/* Candidate Overview */}
        <div className="card shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="row align-items-start">
              <div className="col-md-8">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '4rem', height: '4rem' }}>
                    <User size={32} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="h3 fw-bold text-dark mb-1">{application.candidateName}</h2>
                    <div className="d-flex align-items-center text-muted mb-2">
                      <Mail size={16} className="me-2" />
                      <span>{application.email}</span>
                    </div>
                    <div>
                      <span className="fw-semibold text-dark">Applying for: </span>
                      <span className="text-primary fw-semibold">{application.job_title}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <button
                  onClick={() => setShowResume(!showResume)}
                  className="btn btn-outline-primary"
                >
                  {showResume ? <EyeOff size={16} className="me-2" /> : <Eye size={16} className="me-2" />}
                  {showResume ? 'Hide Resume' : 'View Resume'}
                </button>
              </div>
            </div>
            
            {showResume && (
              <div className="mt-4 pt-4 border-top">
                <h5 className="fw-semibold mb-3">Resume Content</h5>
                <div className="bg-light rounded p-3" style={{ whiteSpace: 'pre-wrap', maxHeight: '15rem', overflowY: 'auto' }}>
                  <small className="text-dark">{application.resume}</small>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="row mb-4">
          <div className="col-lg-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <CircularProgress 
                    percentage={overallScore} 
                    size={100} 
                    strokeWidth={8}
                    label="Job Match"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <CircularProgress 
                    percentage={application.mcq_score} 
                    size={100} 
                    strokeWidth={8}
                    label="Technical"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <CircularProgress 
                    percentage={behavioralAvg} 
                    size={100} 
                    strokeWidth={8}
                    label="Behavioral Score"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <CircularProgress 
                    percentage={normalizedSentiment} 
                    size={100} 
                    strokeWidth={8}
                    label="Sentiment Score"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Skills and Role */}
        <div className="row mb-4">
          <div className="col-lg-6 mb-3">
            <div className="card shadow-sm border-primary border-opacity-25 h-100">
              <div className="card-header bg-primary bg-opacity-10">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <TrendingUp size={20} className="me-2 text-primary" />
                  Key Skills Assessment
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  {application.skills?.map((skill, idx) => (
                    <SkillTag key={idx} skill={skill} />
                  ))}
                </div>
                
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-3">
            <div className="card shadow-sm border-info border-opacity-25 h-100">
              <div className="card-header bg-info bg-opacity-10">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Award size={20} className="me-2 text-info" />
                  Role Classification
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <RoleConfidenceTag role={application.classification} />
                </div>
                <p className="text-muted mb-0">
                  <small>Based on resume analysis and skill assessment, candidate shows strong fit for this role category.</small>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="row mb-4">
          {/* Facial Analysis */}
          <div className="col-lg-4 mb-3">
            <div className="card shadow-sm border-success border-opacity-25 h-100">
              <div className="card-header bg-success bg-opacity-10">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Brain size={20} className="me-2 text-success" />
                  Facial Analysis
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="fw-semibold">Confidence</small>
                    <div className="d-flex align-items-center">
                      <CircularProgress 
                        percentage={application.behavioral_score.facial.confidence * 100} 
                        size={50} 
                        strokeWidth={4}
                        showLabel={false}
                      />
                      <small className="text-muted ms-2">{Math.round(application.behavioral_score.facial.confidence * 100)}%</small>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="fw-semibold">Engagement</small>
                    <div className="d-flex align-items-center">
                      <CircularProgress 
                        percentage={application.behavioral_score.facial.engagement * 100} 
                        size={50} 
                        strokeWidth={4}
                        showLabel={false}
                      />
                      <small className="text-muted ms-2">{Math.round(application.behavioral_score.facial.engagement * 100)}%</small>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="fw-semibold">Stress Level</small>
                    <div className="d-flex align-items-center">
                      <CircularProgress 
                        percentage={application.behavioral_score.facial.stress * 100} 
                        size={50} 
                        strokeWidth={4}
                        showLabel={false}
                      />
                      <small className="text-muted ms-2">{Math.round(application.behavioral_score.facial.stress * 100)}%</small>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Voice Analysis */}
          <div className="col-lg-4 mb-3">
            <div className="card shadow-sm border-warning border-opacity-25 h-100">
              <div className="card-header bg-warning bg-opacity-10">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Mic size={20} className="me-2 text-warning" />
                  Voice Analysis
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="fw-semibold">Confidence</small>
                    <div className="d-flex align-items-center">
                      <CircularProgress 
                        percentage={application.behavioral_score.voice.scores.confidence * 100} 
                        size={50} 
                        strokeWidth={4}
                        showLabel={false}
                      />
                      <small className="text-muted ms-2">{Math.round(application.behavioral_score.voice.scores.confidence * 100)}%</small>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="fw-semibold">Clarity</small>
                    <div className="d-flex align-items-center">
                      <CircularProgress 
                        percentage={application.behavioral_score.voice.scores.clarity * 100} 
                        size={50} 
                        strokeWidth={4}
                        showLabel={false}
                      />
                      <small className="text-muted ms-2">{Math.round(application.behavioral_score.voice.scores.clarity * 100)}%</small>
                    </div>
                  </div>
                </div>
      
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="col-lg-4 mb-3">
            <div className="card shadow-sm border-primary border-opacity-25 h-100">
              <div className="card-header bg-primary bg-opacity-10">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <MessageSquare size={20} className="me-2 text-primary" />
                  Communication Sentiment
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="fw-semibold">Positive</small>
                    <small className="text-muted">{Math.round(application.behavioral_score.text.sentiment.pos * 100)}%</small>
                  </div>
                  <div className="progress mb-2" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{width: `${application.behavioral_score.text.sentiment.pos * 100}%`}}
                    ></div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="fw-semibold">Neutral</small>
                    <small className="text-muted">{Math.round(application.behavioral_score.text.sentiment.neu * 100)}%</small>
                  </div>
                  <div className="progress mb-2" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-secondary" 
                      style={{width: `${application.behavioral_score.text.sentiment.neu * 100}%`}}
                    ></div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="fw-semibold">Negative</small>
                    <small className="text-muted">{Math.round(application.behavioral_score.text.sentiment.neg * 100)}%</small>
                  </div>
                  <div className="progress mb-3" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-danger" 
                      style={{width: `${application.behavioral_score.text.sentiment.neg * 100}%`}}
                    ></div>
                  </div>
                </div>
                <div className="alert alert-light">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="fw-semibold">Overall Sentiment</small>
                    <small className="text-muted">
                      {application.behavioral_score.text.sentiment.compound > 0.1 ? 'Positive' : 
                       application.behavioral_score.text.sentiment.compound < -0.1 ? 'Negative' : 'Neutral'}
                    </small>
                  </div>
                  <small className="text-muted">
                    {application.behavioral_score.text.sentiment.compound >= 0.05
                      ? "Candidate expresses a positive attitude and enthusiasm."
                      : application.behavioral_score.text.sentiment.compound <= -0.05
                        ? "Candidate expresses a negative or cautious tone. Review content for context."
                        : "Candidate's communication tone is neutral and professional."}
                  </small>

                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ApplicationModal;