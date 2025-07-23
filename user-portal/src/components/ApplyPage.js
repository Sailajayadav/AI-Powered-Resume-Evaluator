import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);  // NEW: video
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        } else {
          throw new Error('Job not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load job details.');
      }
    };

    fetchJob();
  }, [jobId]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
      event.target.value = '';
    }
  };

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedVideo(file);
    } else {
      alert('Please select a valid video file');
      event.target.value = '';
    }
  };

  const handleSubmit = async () => {
  if (!selectedFile || !selectedVideo || !applicantName.trim() || !applicantEmail.trim()) {
    alert('Please fill out all fields and select both resume and video');
    return;
  }

  setIsUploading(true);
  try {
    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('video', selectedVideo);
    formData.append('job_id', job._id || job.job_id);
    formData.append('name', applicantName);
    formData.append('email', applicantEmail);

    const response = await fetch('http://localhost:5000/api/apply-job', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      const applicantId = data._id;
      navigate(`/mcq-test/${jobId}/${applicantId}`);
    } else {
      throw new Error('Application failed');
    }
  } catch (err) {
    console.error(err);
    alert('Failed to submit application.');
  } finally {
    setIsUploading(false);
  }
};


  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }



  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: 900, borderRadius: 24, background: '#fff' }}>
        <button className="btn btn-link text-secondary mb-3 px-0" style={{ fontWeight: 500 }} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="d-flex align-items-center mb-4 gap-3">
          <div className="rounded-circle bg-primary d-flex justify-content-center align-items-center" style={{ width: 56, height: 56 }}>
            <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>{job?.title?.charAt(0) || '?'}</span>
          </div>
          <div>
            <h2 className="mb-1" style={{ fontWeight: 700 }}>Apply for {job?.title || '...'}</h2>
            <div className="text-muted small">Job ID: {jobId}</div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: 600 }}>Name:</label>
          <input
            type="text"
            className="form-control"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            disabled={isUploading}
            style={{ borderRadius: 8, fontSize: 16 }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: 600 }}>Email:</label>
          <input
            type="email"
            className="form-control"
            value={applicantEmail}
            onChange={(e) => setApplicantEmail(e.target.value)}
            disabled={isUploading}
            style={{ borderRadius: 8, fontSize: 16 }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: 600 }}>Upload Resume (PDF only):</label>
          <input
            type="file"
            className="form-control"
            accept="application/pdf"
            onChange={handleFileSelect}
            disabled={isUploading}
            style={{ borderRadius: 8, fontSize: 16 }}
          />
          {selectedFile && (
            <div className="mt-2 text-success d-flex align-items-center">
              <CheckCircle className="me-2" /> {selectedFile.name}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: 600 }}>Upload Self-Introduction Video (max 1 min):</label>
          <input
            type="file"
            className="form-control"
            accept="video/*"
            onChange={handleVideoSelect}
            disabled={isUploading}
            style={{ borderRadius: 8, fontSize: 16 }}
          />
          {selectedVideo && (
            <div className="mt-2 text-success d-flex align-items-center">
              <CheckCircle className="me-2" /> {selectedVideo.name}
            </div>
          )}
        </div>

        <div className="border-top pt-4 mt-4 d-flex gap-3 justify-content-end">
          <button
            className="btn btn-primary px-4 py-2"
            onClick={handleSubmit}
            disabled={isUploading || !selectedFile || !selectedVideo || !applicantName || !applicantEmail}
            style={{ fontWeight: 600, borderRadius: 8, fontSize: 16 }}
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
          <button
            className="btn btn-outline-secondary px-4 py-2"
            onClick={() => navigate(-1)}
            disabled={isUploading}
            style={{ fontWeight: 600, borderRadius: 8, fontSize: 16 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
