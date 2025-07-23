import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MCQTestPage = () => {
  const { jobId, applicantId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/jobs/${jobId}/mcqs`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched MCQs:", data);
        setQuestions(data);
      })
      .catch(err => console.error('Error fetching MCQs:', err));
  }, [jobId]);

  const handleSelect = (questionId, option) => {
    setResponses(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(responses).length < questions.length) {
      alert('Please answer all questions');
      return;
    }
    setIsSubmitting(true);

    const payload = {
      applicantId,
      responses: Object.entries(responses).map(([questionId, selected]) => ({
        questionId,
        selected
      }))
    };

    try {
      const res = await fetch(`http://localhost:5000/jobs/${jobId}/evaluate-mcqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      setScore(result.score);

      // Redirect after short delay
      setTimeout(() => {
        navigate(`/application-success/${jobId}`);
      }, 3000);
    } catch (err) {
      alert('Submission failed');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: 900, borderRadius: 24, background: '#fff' }}>
        <button className="btn btn-link text-secondary mb-3 px-0" style={{ fontWeight: 500 }} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="d-flex align-items-center mb-4 gap-3">
          <div className="rounded-circle bg-primary d-flex justify-content-center align-items-center" style={{ width: 56, height: 56 }}>
            <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>Q</span>
          </div>
          <div>
            <h3 className="mb-1" style={{ fontWeight: 700 }}>MCQ Test for Job ID: {jobId}</h3>
            <div className="text-muted small">Answer all questions below</div>
          </div>
        </div>

        {questions.length === 0 ? (
          <div>Loading questions or none available.</div>
        ) : (
          questions.map((q, i) => (
            <div className="mb-4 p-3 rounded" style={{ background: '#f8fafc', border: '1px solid #e0e7ef' }} key={q._id}>
              <h5 className="mb-3" style={{ fontWeight: 600 }}>Q{i + 1}: {q.question}</h5>
              <div className="row">
                {q.options.map(opt => (
                  <div className="col-md-6 mb-2" key={opt}>
                    <label className="w-100 d-flex align-items-center gap-2 p-2 rounded" style={{ border: responses[q._id] === opt ? '2px solid #0d6efd' : '1px solid #ced4da', background: responses[q._id] === opt ? '#e7f1ff' : '#fff', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={responses[q._id] === opt}
                        onChange={() => handleSelect(q._id, opt)}
                        className="form-check-input me-2"
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: 16 }}>{opt}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="border-top pt-4 mt-4 d-flex gap-3 justify-content-end">
          <button
            className="btn btn-success px-4 py-2"
            disabled={isSubmitting}
            onClick={handleSubmit}
            style={{ fontWeight: 600, borderRadius: 8, fontSize: 16 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>

        {score !== null && (
          <div className="mt-4 alert alert-success text-center" style={{ fontSize: 18, fontWeight: 600, borderRadius: 12 }}>
            ✅ Test submitted successfully! Score: {score}%
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQTestPage;
