import React from 'react';

const ApplicationsModal = ({ applications, jobTitle, isOpen, onClose, onViewApplication }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        role="document"
        style={{ maxHeight: '80vh' }}
      >
        <div className="modal-content overflow-auto">
          <div className="modal-header">
            <h5 className="modal-title">Applications for: {jobTitle}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            {applications.length === 0 ? (
              <p>No applications yet.</p>
            ) : (
              <ul className="list-group">
                {applications.map((app) => (
                  <li
                    key={app._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{app.candidateName}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onViewApplication(app)}
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsModal;
