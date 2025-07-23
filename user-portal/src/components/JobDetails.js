import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Calendar } from 'lucide-react';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Jobs
        </button>
      </div>
    );
  }

  const handleApplyClick = () => {
    // Navigate to an application page or open modal
    navigate(`/apply/${job._id || job.job_id}`);
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: 900, borderRadius: 24, background: '#fff' }}>
        <button className="btn btn-link text-secondary mb-3 px-0" style={{ fontWeight: 500 }} onClick={() => navigate('/')}> 
          ← Back to Jobs
        </button>

        <div className="d-flex align-items-center mb-3 gap-3">
          <div className="rounded-circle bg-primary d-flex justify-content-center align-items-center" style={{ width: 56, height: 56 }}>
            <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>{job.title?.charAt(0) || '?'}</span>
          </div>
          <div>
            <h2 className="mb-1" style={{ fontWeight: 700 }}>{job.title}</h2>
            <div className="text-muted small">
              <MapPin size={16} /> {job.location || 'Location not specified'}
              <span className="mx-2">|</span>
              <Calendar size={16} className="ms-2" /> {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {job.salary && (
          <div className="text-success fw-bold mb-3 d-flex align-items-center gap-2">
            <DollarSign size={18} /> <span style={{ fontSize: 18 }}>{job.salary}</span>
          </div>
        )}

        <h5 className="mt-4" style={{ fontWeight: 600 }}>Description</h5>
        <p className="mb-3" style={{ fontSize: 16 }}>{job.description}</p>

        {job.requirements?.length > 0 && (
          <>
            <h5 className="mt-4" style={{ fontWeight: 600 }}>Requirements</h5>
            <ul className="mb-3" style={{ fontSize: 15, paddingLeft: 20 }}>
              {job.requirements.map((req, idx) => (
                <li key={idx} className="mb-1">{req}</li>
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
            onClick={() => navigate('/')}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
