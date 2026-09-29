import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { CareerSearchVisualizer } from './components/CareerSearchVisualizer.jsx';
import { AlgorithmComparisonTable } from './components/AlgorithmComparisonTable.jsx';
import { AssessmentPlayer } from './components/AssessmentPlayer.jsx';
import { DiagnosticReport } from './components/DiagnosticReport.jsx';
import { AILabDemonstration } from './components/AILabDemonstration.jsx';
import { AssessmentHistory } from './components/AssessmentHistory.jsx';
import {
  fetchHealth,
  fetchCourses,
  fetchJobRoles,
  fetchGraphData,
  runSearchAlgorithm,
  compareSearchAlgorithms,
  generateInterviewQuestions,
  submitAssessment
} from './services/api.js';

// Mapping of course to directly related job roles for sorting
const courseRelatedRolesMap = {
  'COURSE_BTECH_AIDS': ['ROLE_DATA_SCIENTIST', 'ROLE_AI_ENGINEER', 'ROLE_DATA_ANALYST'],
  'COURSE_BTECH_CSE': ['ROLE_BACKEND_DEV', 'ROLE_FULLSTACK_DEV', 'ROLE_PYTHON_DEV', 'ROLE_AI_ENGINEER'],
  'COURSE_BCA': ['ROLE_FULLSTACK_DEV', 'ROLE_PYTHON_DEV', 'ROLE_DATA_ANALYST'],
  'COURSE_MCA': ['ROLE_FULLSTACK_DEV', 'ROLE_BACKEND_DEV', 'ROLE_AI_ENGINEER'],
  'COURSE_DATA_SCIENCE': ['ROLE_DATA_SCIENTIST', 'ROLE_DATA_ANALYST', 'ROLE_AI_ENGINEER'],
  'COURSE_MACHINE_LEARNING': ['ROLE_AI_ENGINEER', 'ROLE_DATA_SCIENTIST'],
  'COURSE_PYTHON_PROG': ['ROLE_PYTHON_DEV', 'ROLE_DATA_ANALYST', 'ROLE_BACKEND_DEV'],
  'COURSE_WEB_DEV': ['ROLE_FULLSTACK_DEV', 'ROLE_BACKEND_DEV']
};

export function App() {
  const [activeView, setActiveView] = useState('home'); // home | ailab | interview-setup | assessment | report | history
  const [theme, setTheme] = useState(() => localStorage.getItem('theme-mode') || 'light');
  const [isAiOnline, setIsAiOnline] = useState(false);
  const [courses, setCourses] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [graphData, setGraphData] = useState(null);

  // Progressive Disclosure Selection States
  // When confirmedCourse is null: Show all courses. Part below is hidden.
  // When confirmedCourse is set: Show only selected course + Change Course button. Reveal Step 2 below it.
  const [confirmedCourse, setConfirmedCourse] = useState(null);
  
  // When confirmedRole is null: Show all career options (related first). Part below is hidden.
  // When confirmedRole is set: Show only selected role + Change Role button. Reveal Step 3 below it.
  const [confirmedRole, setConfirmedRole] = useState(null);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('A*');

  // Search results
  const [searchResult, setSearchResult] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Interview setup state
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Mixed');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [isGeneratingPaper, setIsGeneratingPaper] = useState(false);
  const [prefetchedPaper, setPrefetchedPaper] = useState(null);
  const [assessmentPaper, setAssessmentPaper] = useState(null);

  // Assessment results
  const [activeReport, setActiveReport] = useState(null);

  // Apply Theme to document root & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme-mode', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Initial Data Fetch
  useEffect(() => {
    async function init() {
      try {
        const [healthRes, coursesRes, rolesRes, graphRes] = await Promise.all([
          fetchHealth().catch(() => ({ status: 'OFFLINE' })),
          fetchCourses().catch(() => ({ success: false, data: [] })),
          fetchJobRoles().catch(() => ({ success: false, data: [] })),
          fetchGraphData().catch(() => ({ success: false, data: null }))
        ]);

        if (healthRes.status === 'ONLINE') setIsAiOnline(true);
        if (coursesRes.success) setCourses(coursesRes.data);
        if (rolesRes.success) setJobRoles(rolesRes.data);
        if (graphRes.success) setGraphData(graphRes.data);
      } catch (err) {
        console.error('Initial API error:', err);
      }
    }
    init();
  }, []);

  // Background Prefetch for Fast Question Delivery
  const prefetchQuestionsForRole = async (roleId) => {
    if (!roleId) return;
    try {
      const response = await generateInterviewQuestions({
        jobRoleId: roleId,
        count: 5,
        difficulty: 'Mixed',
        topic: 'All Topics'
      });
      if (response && response.success && response.questions?.length > 0) {
        setPrefetchedPaper(response.questions);
      }
    } catch (err) {
      console.warn('Background prefetch note:', err.message);
    }
  };

  // Run Search when Course & Role are confirmed
  const executeCareerSearch = async (courseId, roleId, algo) => {
    if (!courseId || !roleId) return;
    setIsSearching(true);
    try {
      const [singleRes, compRes] = await Promise.all([
        runSearchAlgorithm(courseId, roleId, algo),
        compareSearchAlgorithms(courseId, roleId)
      ]);

      if (singleRes && singleRes.success) {
        setSearchResult(singleRes.data);
      }
      if (compRes && compRes.success) {
        setComparisonData(compRes.data);
      }
    } catch (err) {
      console.error('Career search execution error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Working Inspect Path button for all algorithms (including Greedy Best-First)
  const handleInspectAlgorithm = (algo) => {
    const algoLower = algo.toLowerCase();
    const algoKey = algoLower.includes('bfs') ? 'bfs'
      : algoLower.includes('dfs') ? 'dfs'
      : algoLower.includes('ucs') ? 'ucs'
      : algoLower.includes('greedy') ? 'greedy'
      : 'aStar';

    setSelectedAlgorithm(algo);

    if (comparisonData?.detailedResults?.[algoKey]) {
      const detailed = comparisonData.detailedResults[algoKey];
      setSearchResult({
        ...detailed,
        enrichedPath: detailed.path.map(id => graphData?.nodes?.find(n => n.id === id) || id)
      });
    } else if (confirmedCourse && confirmedRole) {
      executeCareerSearch(confirmedCourse.id, confirmedRole.id, algo);
    }

    document.getElementById('search-visualizer-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Step 1: User selects a course
  const handleSelectCourse = (course) => {
    setConfirmedCourse(course);
    setConfirmedRole(null);
    setSearchResult(null);
    setComparisonData(null);
  };

  // User changes course
  const handleChangeCourse = () => {
    setConfirmedCourse(null);
    setConfirmedRole(null);
    setSearchResult(null);
    setComparisonData(null);
  };

  // Step 2: User selects a job role
  const handleSelectRole = (role) => {
    setConfirmedRole(role);
    executeCareerSearch(confirmedCourse.id, role.id, selectedAlgorithm);
    prefetchQuestionsForRole(role.id);
  };

  // User changes job role
  const handleChangeRole = () => {
    setConfirmedRole(null);
    setSearchResult(null);
    setComparisonData(null);
  };

  // Sort job roles: Related roles FIRST, then other roles
  const relatedRoleIds = confirmedCourse ? (courseRelatedRolesMap[confirmedCourse.id] || []) : [];
  const sortedJobRoles = [...jobRoles].sort((a, b) => {
    const aRelated = relatedRoleIds.includes(a.id);
    const bRelated = relatedRoleIds.includes(b.id);
    if (aRelated && !bRelated) return -1;
    if (!aRelated && bRelated) return 1;
    return 0;
  });

  // Start Mock Interview - Randomizes from the 30-question curated bank on every access
  const handleStartInterview = async () => {
    if (!confirmedRole) return;
    setIsGeneratingPaper(true);
    try {
      const response = await generateInterviewQuestions({
        jobRoleId: confirmedRole.id,
        count: questionCount,
        difficulty
      });

      if (response && response.success && response.questions?.length > 0) {
        setAssessmentPaper(response.questions);
        setActiveView('assessment');
      } else {
        alert('Could not generate assessment questions. Please try again.');
      }
    } catch (err) {
      console.error('Failed to generate interview paper:', err);
      alert('Error generating interview paper.');
    } finally {
      setIsGeneratingPaper(false);
    }
  };

  // Complete Assessment
  const handleAssessmentComplete = async (completedAttempts) => {
    try {
      const res = await submitAssessment({
        jobRoleId: confirmedRole?.id || 'ROLE_DATA_SCIENTIST',
        attempts: completedAttempts
      });

      if (res && res.success && res.report) {
        setActiveReport(res.report);
        setActiveView('report');
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isAiOnline={isAiOnline}
        theme={theme}
        toggleTheme={toggleTheme}
        isMockDisabled={!confirmedRole}
      />

      <main className="main-content" style={{ flex: 1 }}>
        {/* =========================================================================
            VIEW 1: CAREER PATH FINDER (PROGRESSIVE ONE-BY-ONE DISCLOSURE)
           ========================================================================= */}
        {activeView === 'home' && (
          <div className="animate-fade-in">
            {/* Top Heading */}
            <div style={{ textAlign: 'center', margin: '6px auto 32px auto', maxWidth: '820px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '10px' }}>
                AI LAB SEARCH ALGORITHMS + GENERATIVE AI
              </span>
              <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '12px' }}>
                Career Pathway & <span className="gradient-accent">Interview Preparation</span>
              </h1>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)' }}>
                Select your academic degree to discover optimal career preparation paths using graph search algorithms.
              </p>
            </div>

            {/* STEP 1: COURSE SELECTION */}
            <div style={{ marginBottom: '32px' }}>
              {!confirmedCourse ? (
                /* Step 1: Unconfirmed -> Show full selection grid */
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                        Question 1: Which Course Have You Completed or Studied?
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        Select your academic background to unlock tailored career profiles:
                      </p>
                    </div>
                    <span className="badge badge-primary">Step 1 of 3</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                    {courses.map(course => (
                      <div
                        key={course.id}
                        className="selection-card"
                        onClick={() => handleSelectCourse(course)}
                      >
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                          {course.category}
                        </div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                          {course.name}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          {course.description.slice(0, 95)}...
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {course.primarySkills.slice(0, 3).map((sk, idx) => (
                            <span key={idx} className="code-badge">{sk}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Step 1: Confirmed -> Show ONLY selected course with "Change Course" button */
                <div className="confirmed-item-card animate-fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(37, 99, 235, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      🎓
                    </div>
                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Selected Academic Course (Step 1 Completed)
                      </div>
                      <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '2px 0' }}>
                        {confirmedCourse.name}
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Category: {confirmedCourse.category} | Duration: {confirmedCourse.duration}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary"
                    onClick={handleChangeCourse}
                    style={{ fontSize: '0.86rem' }}
                  >
                    🔄 Change Course
                  </button>
                </div>
              )}
            </div>

            {/* STEP 2: CAREER PROFILE SELECTION (Only visible when course is confirmed!) */}
            {confirmedCourse && (
              <div style={{ marginBottom: '32px' }} className="animate-fade-in">
                {!confirmedRole ? (
                  /* Step 2: Unconfirmed -> Show sorted job roles */
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                          Question 2: Select Your Target Career Profile
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          Showing profiles matching <strong style={{ color: 'var(--primary)' }}>{confirmedCourse.name}</strong> first:
                        </p>
                      </div>
                      <span className="badge badge-emerald">Step 2 of 3</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      {sortedJobRoles.map(role => {
                        const isRelated = relatedRoleIds.includes(role.id);
                        return (
                          <div
                            key={role.id}
                            className="selection-card"
                            onClick={() => handleSelectRole(role)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '0.72rem', color: isRelated ? '#059669' : 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>
                                {role.category}
                              </span>
                              {isRelated && (
                                <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                                  ★ Recommended
                                </span>
                              )}
                            </div>
                            <h4 style={{ fontSize: '1.15rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                              {role.title}
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                              {role.description.slice(0, 95)}...
                            </p>
                            <div style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)' }}>
                              Key Topics: {role.importantTopics.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Step 2: Confirmed -> Show ONLY selected role with "Change Role" button */
                  <div className="confirmed-item-card animate-fade-in" style={{ borderColor: 'var(--accent-emerald)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        🎯
                      </div>
                      <div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Target Career Profile (Step 2 Completed)
                        </div>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '2px 0' }}>
                          {confirmedRole.title}
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Category: {confirmedRole.category} | Key Topics: {confirmedRole.importantTopics.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary"
                      onClick={handleChangeRole}
                      style={{ fontSize: '0.86rem' }}
                    >
                      🔄 Change Role
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: ALGORITHMIC PATHWAY & BENCHMARK MATRIX (Only visible when role is confirmed!) */}
            {confirmedCourse && confirmedRole && (
              <div className="animate-fade-in">
                {/* Visualizer */}
                {searchResult ? (
                  <CareerSearchVisualizer
                    searchResult={searchResult}
                    selectedAlgorithm={selectedAlgorithm}
                    onAlgorithmChange={(algo) => {
                      setSelectedAlgorithm(algo);
                      executeCareerSearch(confirmedCourse.id, confirmedRole.id, algo);
                    }}
                  />
                ) : (
                  <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {isSearching ? 'Executing Search Algorithms...' : 'Preparing Career Pathway...'}
                  </div>
                )}

                {/* Benchmark Matrix */}
                {comparisonData && (
                  <AlgorithmComparisonTable
                    comparisonData={comparisonData}
                    currentAlgo={selectedAlgorithm}
                    onSelectAlgorithm={handleInspectAlgorithm}
                  />
                )}

                {/* Proceed to Mock Interview CTA */}
                <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', marginTop: '36px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(2, 132, 199, 0.06) 100%)' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                    Ready to practice for <span className="gradient-accent">{confirmedRole.title}</span>?
                  </h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '640px', margin: '0 auto 20px auto' }}>
                    Your career path has been determined. Start the AI-generated mock interview to assess your knowledge and receive deep qualitative feedback.
                  </p>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '12px 32px', fontSize: '1rem' }}
                    onClick={() => setActiveView('interview-setup')}
                  >
                    Proceed to Mock Interview Preparation ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VIEW 2: AI LAB DEMONSTRATION
           ========================================================================= */}
        {activeView === 'ailab' && (
          <AILabDemonstration graphData={graphData} />
        )}

        {/* =========================================================================
            VIEW 3: INTERVIEW SETUP (Locked until Job Profile is selected)
           ========================================================================= */}
        {activeView === 'interview-setup' && (
          !confirmedRole ? (
            <div className="glass-panel animate-fade-in" style={{
              maxWidth: '680px',
              margin: '40px auto',
              padding: '48px 36px',
              textAlign: 'center',
              border: '1.5px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1.5px solid rgba(239, 68, 68, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '20px'
              }}>
                🔒
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>
                Mock Interview is Disabled
              </h2>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.98rem',
                lineHeight: '1.65',
                marginBottom: '28px',
                maxWidth: '520px',
                margin: '0 auto 28px auto'
              }}>
                The interview assessment is customized to your career destination. Please go to the <strong>Career Path Finder</strong> on the home page, select your course, and confirm your target job profile to unlock the mock interview.
              </p>

              <div>
                <button
                  className="btn btn-primary"
                  style={{
                    padding: '14px 32px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onClick={() => setActiveView('home')}
                >
                  <span>🎯</span> Go to Home Page (Career Path Finder)
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div style={{ marginBottom: '28px' }}>
                <button className="btn btn-secondary" onClick={() => setActiveView('home')} style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
                  ← Back to Career Path
                </button>
                <h2 style={{ fontSize: '2rem', marginBottom: '6px' }}>
                  Interview Assessment Setup: <span className="gradient-accent">{confirmedRole.title}</span>
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  Configure your mock interview parameters. Questions are drawn dynamically in randomized order from the 30-question curated bank.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.92rem', marginBottom: '8px', color: 'var(--primary)' }}>
                    Prerequisites & Required Competencies
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(confirmedRole.requiredSkills || []).map((skill, idx) => (
                      <span key={idx} className="code-badge" style={{ padding: '4px 10px', fontSize: '0.85rem' }}>
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Number of Questions:
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-secondary)',
                        border: '1.5px solid var(--border-subtle)',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                        fontWeight: 600
                      }}
                    >
                      <option value={5}>5 Questions (Fast Practice)</option>
                      <option value={10}>10 Questions (Standard Mock)</option>
                      <option value={15}>15 Questions (Comprehensive)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Difficulty Level:
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-secondary)',
                        border: '1.5px solid var(--border-subtle)',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                        fontWeight: 600
                      }}
                    >
                      <option value="Mixed">Mixed (Balanced Progression)</option>
                      <option value="Easy">Easy (Fundamental Concepts)</option>
                      <option value="Medium">Medium (Practical Application)</option>
                      <option value="Hard">Hard (Advanced Technical Depth)</option>
                    </select>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
                  onClick={handleStartInterview}
                  disabled={isGeneratingPaper}
                >
                  {isGeneratingPaper ? 'Preparing Questions...' : '🚀 Start Mock Interview'}
                </button>
              </div>
            </div>
          )
        )}

        {/* =========================================================================
            VIEW 4: ASSESSMENT PLAYER
           ========================================================================= */}
        {activeView === 'assessment' && assessmentPaper && (
          <AssessmentPlayer
            questions={assessmentPaper}
            jobRole={confirmedRole}
            onComplete={handleAssessmentComplete}
          />
        )}

        {/* =========================================================================
            VIEW 5: DIAGNOSTIC REPORT
           ========================================================================= */}
        {activeView === 'report' && activeReport && (
          <DiagnosticReport
            report={activeReport}
            onRetake={() => setActiveView('interview-setup')}
            onBackToCareers={() => {
              setActiveView('home');
              setConfirmedCourse(null);
              setConfirmedRole(null);
            }}
          />
        )}

        {/* =========================================================================
            VIEW 6: ASSESSMENT HISTORY
           ========================================================================= */}
        {activeView === 'history' && (
          <AssessmentHistory />
        )}
      </main>
    </div>
  );
}

export default App;
