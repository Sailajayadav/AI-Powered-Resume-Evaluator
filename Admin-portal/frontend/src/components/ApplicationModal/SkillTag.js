import React from 'react';

const SkillTag = ({ skill }) => {
  return (
    <span className="badge bg-light text-dark border rounded-pill me-2 mb-2 px-3 py-2">
      {skill}
    </span>
  );
};

export default SkillTag;
