import React, { useState, useEffect } from 'react';
import { fetchAssessmentHistory, clearAssessmentHistory } from '../services/api.js';

export function AssessmentHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAssessmentHistory();
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your assessment history?')) {
      await clearAssessmentHistory();
      setHistory([]);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '36px', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Assessment History</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Previous mock interview results and skill trajectory
          </p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-secondary" onClick={handleClear} style={{ fontSize: '0.85rem' }}>
            Clear History
          </button>
        )}
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading assessment history...
        </div>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📝</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: '#e2e8f0' }}>No past assessments found</h3>
          <p style={{ fontSize: '0.88rem' }}>Complete a mock interview to track your performance history here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {history.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '20px 24px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{item.jobRoleTitle}</h4>
                  <span className="badge badge-primary">
                    {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Questions: <strong>{item.totalQuestions}</strong> | 
                  Score: <strong style={{ color: '#fff' }}>{item.score}/{item.totalQuestions}</strong> | 
                  Weak Topics: <span style={{ color: item.weakTopics?.length ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                    {item.weakTopics?.length ? item.weakTopics.join(', ') : 'None'}
                  </span>
                </div>
              </div>

              <div style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: item.accuracyPercent >= 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)'
              }}>
                {item.accuracyPercent}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssessmentHistory;
