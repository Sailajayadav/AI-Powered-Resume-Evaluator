import React, { useState, useEffect } from 'react';
import JobForm from '../components/JobForm/JobForm';
import JobCard from '../components/JobCard/JobCard';
import { useNavigate } from 'react-router-dom';
import ApplicationsModal from '../components/ApplicationsModal/ApplicationsModal';

// Custom styles for professional look
const styles = {
  card: {
    borderRadius: '18px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: 'none',
    background: '#fff',
  },
  header: {
    background: 'linear-gradient(90deg, #007bff 0%, #00c6ff 100%)',
    color: '#fff',
    borderRadius: '18px 18px 0 0',
    padding: '2rem 1.5rem 1rem 1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  title: {
    fontWeight: 700,
    fontSize: '2.1rem',
    letterSpacing: '-1px',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 0,
  },
  section: {
    marginTop: '2.5rem',
    marginBottom: '2.5rem',
  },
  jobForm: {
    marginBottom: '2.5rem',
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    background: '#f8f9fa',
    padding: '1.5rem',
  },
  jobsRow: {
    marginTop: '1.5rem',
    rowGap: '2rem',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  noJobs: {
    color: '#adb5bd',
    fontSize: '1.15rem',
    padding: '2.5rem 0',
    fontWeight: 500,
  },
  loading: {
    color: '#6c757d',
    fontSize: '1.15rem',
    padding: '2.5rem 0',
    fontWeight: 500,
  },
};

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const navigate = useNavigate();  // ✅ Added

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const viewApplications = async (jobId, jobTitle) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/applications`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data);
      setCurrentJobTitle(jobTitle);
      setIsApplicationsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeApplicationsModal = () => {
    setIsApplicationsModalOpen(false);
    setApplications([]);
    setCurrentJobTitle('');
  };

  const viewApplicationDetails = (application) => {
    // ✅ Navigate to a route like /applications/{id}
    navigate(`/applications/${application._id}`, { state: { application } });
  };


  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setSelectedApplication(null);
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete job');
      loadJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f8fafc 0%, #e9ecef 100%)' }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* Header Section */}
        <div className="mb-4" style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Job Portal Admin Dashboard</h1>
            <p style={styles.subtitle}>Manage job postings and view applications submitted by candidates.</p>
          </div>
        </div>

        {/* Job Form Section */}
        <section style={styles.section}>
          <div style={styles.jobForm}>
            <h2 className="h5 mb-3" style={{ fontWeight: 600, color: '#007bff' }}>Post a New Job</h2>
            <JobForm onJobPosted={loadJobs} />
          </div>
        </section>

        {/* Jobs List Section */}
        <section style={styles.section}>
          <h2 className="h5 mb-4" style={{ fontWeight: 600, color: '#343a40' }}>Current Job Postings</h2>
          <div className="row" style={styles.jobsRow}>
            {isLoading ? (
              <div className="col-12 text-center" style={styles.loading}>Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="col-12 text-center" style={styles.noJobs}>No job postings available.</div>
            ) : (
              jobs.map((job) => (
                <div className="col-12 col-md-6 col-lg-4 mb-4" key={job._id}>
                  <JobCard
                    job={job}
                    onViewApplications={viewApplications}
                    onDeleteJob={deleteJob}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Applications Modal */}
        <ApplicationsModal
          applications={applications}
          jobTitle={currentJobTitle}
          isOpen={isApplicationsModalOpen}
          onClose={closeApplicationsModal}
          onViewApplication={viewApplicationDetails}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
