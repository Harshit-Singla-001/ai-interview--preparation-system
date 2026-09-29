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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px', color: 'var(--text-main)', fontWeight: 800 }}>Assessment History</h2>
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
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: 'var(--text-main)' }}>No past assessments found</h3>
          <p style={{ fontSize: '0.88rem' }}>Complete a mock interview to track your performance history here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map((item, idx) => {
            const isGood = item.accuracyPercent >= 70;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '22px 28px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
                      {item.jobRoleTitle || 'Mock Assessment'}
                    </h4>
                    <span className="badge badge-primary" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
                      {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
                    <span>
                      Questions: <strong style={{ color: 'var(--text-main)' }}>{item.totalQuestions}</strong>
                    </span>
                    <span style={{ color: 'var(--border-subtle)' }}>•</span>
                    <span>
                      Score: <strong style={{ color: 'var(--text-main)' }}>{item.score} / {item.totalQuestions}</strong>
                    </span>
                    <span style={{ color: 'var(--border-subtle)' }}>•</span>
                    <span>
                      Weak Topics:{' '}
                      <strong style={{ color: item.weakTopics?.length ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                        {item.weakTopics?.length ? item.weakTopics.join(', ') : 'None (All Passed)'}
                      </strong>
                    </span>
                  </div>
                </div>

                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: isGood ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                  background: isGood ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  border: `1.5px solid ${isGood ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  minWidth: '95px'
                }}>
                  {item.accuracyPercent}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AssessmentHistory;
