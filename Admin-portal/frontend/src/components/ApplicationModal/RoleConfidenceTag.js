import React from 'react';

const RoleConfidenceTag = ({ role }) => {
  return (
    <div className="badge bg-light text-dark border rounded-pill d-inline-flex align-items-center me-2 mb-2 px-3 py-2">
      <span className="fw-semibold">{role}</span>
    </div>
  );
};

export default RoleConfidenceTag;
