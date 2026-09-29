import React from 'react';

export function DiagnosticReport({ report, onRetake, onBackToCareers }) {
  if (!report) return null;

  const { jobRoleTitle, score, totalQuestions, accuracyPercent, topicBreakdown, weakTopics, aiFeedback } = report;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', padding: '6px 16px', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.12)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 800, marginBottom: '12px' }}>
          INTERVIEW PREPARATION REPORT
        </div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>
          Performance Diagnostics: <span className="gradient-accent">{jobRoleTitle}</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Detailed evaluation powered by AI Search Path finding and Google Gemini feedback
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '36px' }}>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', borderColor: 'var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Overall Score</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {score} <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>/ {totalQuestions}</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', borderColor: accuracyPercent >= 70 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Accuracy</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: accuracyPercent >= 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
            {accuracyPercent}%
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Weak Topics</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: weakTopics && weakTopics.length > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            {weakTopics ? weakTopics.length : 0}
          </div>
        </div>
      </div>

      {/* Topic-Wise Breakdown */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '18px', color: 'var(--text-main)' }}>Topic-Wise Mastery</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(topicBreakdown || []).map((t, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.topic}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                  {t.correct}/{t.total} ({t.accuracy}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${t.accuracy}%`,
                  height: '100%',
                  background: t.accuracy >= 70 ? 'var(--accent-emerald)' : t.accuracy >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Qualitative Feedback & Roadmap */}
      {aiFeedback && (
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '36px', background: 'rgba(37, 99, 235, 0.05)', borderColor: 'var(--border-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.3rem' }}>🤖</span>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
              AI Mentor Diagnostic Summary
            </h3>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '18px', lineHeight: '1.6' }}>
            {aiFeedback.overallSummary}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '0.85rem', marginBottom: '6px' }}>
                KEY STRENGTHS
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {aiFeedback.strengths}
              </p>
            </div>

            <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <div style={{ fontWeight: 800, color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: '6px' }}>
                AREAS FOR IMPROVEMENT
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {aiFeedback.weaknesses}
              </p>
            </div>
          </div>

          {/* Actionable Revision Roadmap */}
          {aiFeedback.revisionRoadmap && aiFeedback.revisionRoadmap.length > 0 && (
            <div>
              <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '10px' }}>
                🎯 RECOMMENDED PREPARATION ROADMAP
              </div>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {aiFeedback.revisionRoadmap.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={onRetake}>
          🔄 Retake Assessment
        </button>
        <button className="btn btn-secondary" onClick={onBackToCareers}>
          🔍 Explore Other Career Paths
        </button>
      </div>
    </div>
  );
}

export default DiagnosticReport;
