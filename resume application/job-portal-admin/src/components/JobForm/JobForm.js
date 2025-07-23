import React, { useState } from 'react';

const JobForm = ({ onJobPosted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [mcqTopics, setMcqTopics] = useState('');
  const [mcqsPerTopic, setMcqsPerTopic] = useState(5);
  const [codingTopics, setCodingTopics] = useState('');
  const [codingCount, setCodingCount] = useState(2);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location || !salary) {
      setError('All fields are required');
      return;
    }

    // Split topic strings into arrays
    const mcqTopicsArray = mcqTopics.split(/[\s,]+/).filter(Boolean);
    const codingTopicsArray = codingTopics.split(/[\s,]+/).filter(Boolean);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          location,
          salary,
          assessment: {
            mcqTopics: mcqTopicsArray,
            mcqsPerTopic: Number(mcqsPerTopic),
            codingTopics: codingTopicsArray,
            codingQuestions: Number(codingCount),
          }
        }),
      });
      if (!response.ok) throw new Error('Failed to post job');
      onJobPosted();

      // Reset fields
      setTitle('');
      setDescription('');
      setLocation('');
      setSalary('');
      setMcqTopics('');
      setMcqsPerTopic(5);
      setCodingTopics('');
      setCodingCount(2);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4">
      <h2 className="h5 mb-3">Post a New Job</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Job Description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
      </div>

      {/* 🔽 Assessment Section */}
      <h5 className="mt-4">Assessment Configuration</h5>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="MCQ Topics (comma or space separated)"
          value={mcqTopics}
          onChange={(e) => setMcqTopics(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="MCQs per Topic"
          value={mcqsPerTopic}
          min={1}
          max={10}
          onChange={(e) => setMcqsPerTopic(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Coding Topics (comma or space separated)"
          value={codingTopics}
          onChange={(e) => setCodingTopics(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Number of Coding Questions"
          value={codingCount}
          min={1}
          max={5}
          onChange={(e) => setCodingCount(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary">Post Job</button>
    </form>
  );
};

export default JobForm;
