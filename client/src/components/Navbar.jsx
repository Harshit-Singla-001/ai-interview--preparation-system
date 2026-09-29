import React from 'react';

export function Navbar({ activeView, setActiveView, isAiOnline, theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        onClick={() => setActiveView('home')}
      >
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 0 20px rgba(37, 99, 235, 0.35)'
        }}>
          🧠
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            AI INTERVIEW PREP
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Search Algorithms & Generative AI</span>
            <span style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isAiOnline ? '#059669' : '#d97706'
            }} />
          </div>
        </div>
      </div>

      <div className="nav-links">
        <button
          className={`nav-btn ${activeView === 'home' ? 'active' : ''}`}
          onClick={() => setActiveView('home')}
        >
          <span>🎯</span> Career Path Finder
        </button>

        <button
          className={`nav-btn ${activeView === 'ailab' ? 'active' : ''}`}
          onClick={() => setActiveView('ailab')}
        >
          <span>🔬</span> AI Lab Demo
        </button>

        <button
          className={`nav-btn ${activeView === 'interview-setup' || activeView === 'assessment' || activeView === 'report' ? 'active' : ''}`}
          onClick={() => setActiveView('interview-setup')}
        >
          <span>📝</span> Mock Interview
        </button>

        <button
          className={`nav-btn ${activeView === 'history' ? 'active' : ''}`}
          onClick={() => setActiveView('history')}
        >
          <span>📊</span> Past Reports
        </button>

        {/* Day / Night Theme Toggle Button */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          type="button"
          title={`Switch to ${theme === 'dark' ? 'Day (Light)' : 'Night (Dark)'} Mode`}
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Day Mode' : 'Night Mode'}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
