import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, Briefcase, CheckCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicantName, setApplicantName] = React.useState('');
  const [applicantEmail, setApplicantEmail] = React.useState('');

  const navigate = useNavigate();

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/jobs');
      if (response.ok) {
        const jobsData = await response.json();
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setError(null);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const handleJobClick = (job) => {
    navigate(`/job/${job._id || job.job_id}`);
  };

  const handleApplyClick = () => {
    setShowJobDetails(false);
    setShowApplicationModal(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert('Please select a PDF file');
        event.target.value = '';
      }
    }
  };

const handleSubmitApplication = async () => {
  if (!selectedFile) {
    alert('Please select a resume file');
    return;
  }
  if (!applicantName.trim()) {
    alert('Please enter your name');
    return;
  }
  if (!applicantEmail.trim()) {
    alert('Please enter your email');
    return;
  }

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('job_id', selectedJob.job_id || selectedJob._id);
    formData.append('name', applicantName);
    formData.append('email', applicantEmail);

    const response = await fetch('http://localhost:5000/api/apply-job', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setShowApplicationModal(false);
      setShowSuccessModal(true);
      setSelectedFile(null);
      setApplicantName('');  // clear input after success
      setApplicantEmail('');
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Application failed');
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    alert('Failed to submit application. Please try again.');
  } finally {
    setIsUploading(false);
  }
};


  const closeAllModals = () => {
    setShowJobDetails(false);
    setShowApplicationModal(false);
    setShowSuccessModal(false);
    setSelectedJob(null);
    setSelectedFile(null);
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container py-4 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-0">Job Portal</h1>
            <p className="text-muted mb-0">Find your dream job today</p>
          </div>
          <div>
            <span className="badge bg-primary fs-6">{jobs.length} Jobs Available</span>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white shadow-sm border-bottom">
        <div className="container py-4">
          <div className="position-relative mx-auto" style={{ maxWidth: '600px' }}>
            <Search className="position-absolute top-50 translate-middle-y text-muted" style={{ left: '15px', pointerEvents: 'none' }} />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search jobs by title, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-5">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">
            {error}
            <div className="mt-3">
              <button 
                onClick={fetchJobs}
                className="btn btn-danger"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-5">
            <Briefcase className="text-secondary mb-3" size={48} />
            <h4>No jobs found</h4>
            <p className="text-muted">
              {searchTerm ? 'Try adjusting your search terms' : 'No job postings available at the moment'}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredJobs.map((job) => (
              <div key={job._id || job.job_id} className="col-md-6 col-xl-6">
                <div 
                  className="card h-100 border-secondary cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleJobClick(job)}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <h5 className="card-title text-primary">{job.title}</h5>
                        <div className="d-flex align-items-center text-secondary">
                          <MapPin size={16} className="me-1" />
                          <small>{job.location || 'Location not specified'}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        {job.salary && (
                          <div className="text-success fw-semibold mb-2 d-flex align-items-center justify-content-end">
                            <DollarSign size={16} className="me-1" />
                            <small>{job.salary}</small>
                          </div>
                        )}
                        <div className="d-flex align-items-center text-muted small">
                          <Clock size={16} className="me-1" />
                          <small>{getTimeAgo(job.createdAt)}</small>
                        </div>
                      </div>
                    </div>
                    <p className="card-text text-truncate" style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description && job.description.length > 150
                        ? job.description.substring(0, 150) + '...'
                        : job.description}
                    </p>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mt-auto d-flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span key={index} className="badge bg-primary text-truncate" style={{ maxWidth: '150px' }}>
                            {req.length > 25 ? req.substring(0, 25) + '...' : req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="badge bg-secondary">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {console.log(selectedJob)}  
      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 24 }}>
              <div className="modal-header border-bottom bg-white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary d-flex justify-content-center align-items-center" style={{ width: 56, height: 56 }}>
                    <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>{selectedJob.title?.charAt(0) || '?'}</span>
                  </div>
                  <div>
                    <h4 className="modal-title mb-1" style={{ fontWeight: 700 }}>{selectedJob.title}</h4>
                    <div className="d-flex flex-wrap gap-3 text-muted mt-1 small">
                      <div className="d-flex align-items-center">
                        <MapPin size={16} className="me-1" />
                        <span>{selectedJob.location || 'Location not specified'}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <Calendar size={16} className="me-1" />
                        <span>Posted {getTimeAgo(selectedJob.createdAt)}</span>
                      </div>
                    </div>
                    {selectedJob.salary && (
                      <div className="d-flex align-items-center text-success fw-semibold mt-2 fs-5">
                        <DollarSign size={20} className="me-2" />
                        <span>{selectedJob.salary}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowJobDetails(false)}></button>
              </div>
              <div className="modal-body bg-white" style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <h6 className="mb-3" style={{ fontWeight: 600 }}>Job Description</h6>
                <p style={{ whiteSpace: 'pre-line', fontSize: 16 }}>{selectedJob.description || 'No description available.'}</p>

                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <>
                    <h6 className="mt-4 mb-3" style={{ fontWeight: 600 }}>Requirements</h6>
                    <ul style={{ fontSize: 15, paddingLeft: 20 }}>
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="mb-1">{req}</li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="border-top pt-4 mt-4 d-flex gap-3 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary px-4 py-2"
                    style={{ fontWeight: 600, borderRadius: 8, fontSize: 16 }}
                    onClick={handleApplyClick}
                  >
                    Apply Now
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 py-2"
                    style={{ fontWeight: 600, borderRadius: 8, fontSize: 16 }}
                    onClick={() => setShowJobDetails(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
        {showApplicationModal && selectedJob && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header border-bottom">
                <h5 className="modal-title">Apply for {selectedJob.title}</h5>
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowApplicationModal(false)}
                />
                </div>
                <div className="modal-body">
                <div className="mb-3">
                    <label htmlFor="applicant-name" className="form-label">
                    Name:
                    </label>
                    <input
                    type="text"
                    id="applicant-name"
                    className="form-control"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isUploading}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="applicant-email" className="form-label">
                    Email:
                    </label>
                    <input
                    type="email"
                    id="applicant-email"
                    className="form-control"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={isUploading}
                    />
                </div>

                <label htmlFor="resume-upload" className="form-label">
                    Upload your resume (PDF only):
                </label>
                <input
                    type="file"
                    id="resume-upload"
                    className="form-control"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />
                {selectedFile && (
                    <div className="mt-3 d-flex align-items-center text-success">
                    <CheckCircle className="me-2" />
                    <span>{selectedFile.name}</span>
                    </div>
                )}
                </div>
                <div className="modal-footer border-top">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmitApplication}
                    disabled={isUploading || !selectedFile || !applicantName || !applicantEmail}
                >
                    {isUploading ? (
                    <>
                        <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                        ></span>
                        Uploading...
                    </>
                    ) : (
                    'Submit Application'
                    )}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowApplicationModal(false)}
                    disabled={isUploading}
                >
                    Cancel
                </button>
                </div>
            </div>
            </div>
        </div>
        )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">Application Submitted</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeAllModals}></button>
              </div>
              <div className="modal-body text-center">
                <CheckCircle size={48} className="text-success mb-3" />
                <p>Your application has been submitted successfully!</p>
                <button className="btn btn-success" onClick={closeAllModals}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPortal;

