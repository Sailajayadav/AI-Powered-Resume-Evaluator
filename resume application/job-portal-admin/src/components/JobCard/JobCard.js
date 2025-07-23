import React from 'react';

const JobCard = ({ job, onViewApplications, onDeleteJob }) => {
  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title">{job.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {job.jobRole} - {job.location}
          </h6>
          <p className="card-text">
            {job.description.length > 150
              ? job.description.substring(0, 150) + '...'
              : job.description}
          </p>
        </div>
        <div className="mt-3 d-flex justify-content-between">
          <button
            onClick={() => onViewApplications(job._id, job.title)}
            className="btn btn-secondary"
          >
            View Applications
          </button>
          <button
            onClick={() => onDeleteJob(job._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
