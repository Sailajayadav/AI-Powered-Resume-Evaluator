import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MCQTestPage = () => {
  // Extract jobId and applicantId from URL parameters
  const { jobId, applicantId } = useParams();
  const navigate = useNavigate();

  // State to store the fetched MCQ questions
  const [questions, setQuestions] = useState([]);
  // State to store user's selected responses (key: questionId, value: selected option)
  const [responses, setResponses] = useState({});
  // State to track submission status (used to disable button during submission)
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State to store the test score after submission
  const [score, setScore] = useState(null);

  /**
   * Fetch MCQs for the specific job when the component loads.
   * Dependency on jobId ensures it fetches whenever jobId changes.
   */
  useEffect(() => {
    fetch(`http://localhost:5000/jobs/${jobId}/mcqs`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched MCQs:", data);
        setQuestions(data);
      })
      .catch(err => console.error('Error fetching MCQs:', err));
  }, [jobId]);

  /**
   * Handle the selection of an option for a question.
   * Updates the `responses` state.
   */
  const handleSelect = (questionId, option) => {
    setResponses(prev => ({ ...prev, [questionId]: option }));
  };

  /**
   * Handle the test submission.
   * - Validates that all questions are answered.
   * - Sends the user's responses to the backend for evaluation.
   * - Shows the score and redirects to success page after 3 seconds.
   */
  const handleSubmit = async () => {
    // Ensure all questions are answered
    if (Object.keys(responses).length < questions.length) {
      alert('Please answer all questions');
      return;
    }
    setIsSubmitting(true);

    // Prepare payload for backend
    const payload = {
      applicantId,
      responses: Object.entries(responses).map(([questionId, selected]) => ({
        questionId,
        selected
      }))
    };

    try {
      // Send responses to backend for evaluation
      const res = await fetch(`http://localhost:5000/jobs/${jobId}/evaluate-mcqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      setScore(result.score); // Store the returned score

      // Redirect to success page after a short delay
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
        {/* Back button */}
        <button className="btn btn-link text-secondary mb-3 px-0" style={{ fontWeight: 500 }} onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Page Header */}
        <div className="d-flex align-items-center mb-4 gap-3">
          <div className="rounded-circle bg-primary d-flex justify-content-center align-items-center" style={{ width: 56, height: 56 }}>
            <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>Q</span>
          </div>
          <div>
            <h3 className="mb-1" style={{ fontWeight: 700 }}>MCQ Test for Job ID: {jobId}</h3>
            <div className="text-muted small">Answer all questions below</div>
          </div>
        </div>

        {/* Question list */}
        {questions.length === 0 ? (
          <div>Loading questions or none available.</div>
        ) : (
          questions.map((q, i) => (
            <div className="mb-4 p-3 rounded" style={{ background: '#f8fafc', border: '1px solid #e0e7ef' }} key={q._id}>
              <h5 className="mb-3" style={{ fontWeight: 600 }}>Q{i + 1}: {q.question}</h5>
              <div className="row">
                {q.options.map(opt => (
                  <div className="col-md-6 mb-2" key={opt}>
                    {/* Option label with highlighting for selected option */}
                    <label className="w-100 d-flex align-items-center gap-2 p-2 rounded"
                      style={{
                        border: responses[q._id] === opt ? '2px solid #0d6efd' : '1px solid #ced4da',
                        background: responses[q._id] === opt ? '#e7f1ff' : '#fff',
                        cursor: 'pointer'
                      }}>
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

        {/* Submit button */}
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
      </div>
    </div>
  );
};

export default MCQTestPage;
