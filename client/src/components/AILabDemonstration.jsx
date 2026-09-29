import React, { useState, useEffect } from 'react';
import { runSearchAlgorithm, compareSearchAlgorithms } from '../services/api.js';
import { AlgorithmComparisonTable } from './AlgorithmComparisonTable.jsx';
import { CareerSearchVisualizer } from './CareerSearchVisualizer.jsx';

export function AILabDemonstration({ graphData }) {
  const [startNode, setStartNode] = useState('COURSE_BTECH_AIDS');
  const [goalNode, setGoalNode] = useState('ROLE_DATA_SCIENTIST');
  const [algorithm, setAlgorithm] = useState('A*');
  const [searchResult, setSearchResult] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  const nodes = graphData?.nodes || [];
  const startCandidates = nodes.filter(n => n.type === 'COURSE' || n.type === 'SKILL');
  const goalCandidates = nodes.filter(n => n.type === 'JOB_ROLE' || n.type === 'TOPIC');

  const executeExperiment = async () => {
    try {
      const [singleRes, compRes] = await Promise.all([
        runSearchAlgorithm(startNode, goalNode, algorithm),
        compareSearchAlgorithms(startNode, goalNode)
      ]);

      if (singleRes.success) {
        setSearchResult(singleRes.data);
      }
      if (compRes.success) {
        setComparisonData(compRes.data);
      }
    } catch (err) {
      console.error('Experiment failed:', err);
    }
  };

  // Automatically update search whenever startNode, goalNode, or algorithm changes (No manual run button needed)
  useEffect(() => {
    executeExperiment();
  }, [startNode, goalNode, algorithm]);

  const handleInspectAlgorithm = (algo) => {
    const algoKey = algo.toLowerCase().includes('bfs') ? 'bfs'
      : algo.toLowerCase().includes('dfs') ? 'dfs'
      : algo.toLowerCase().includes('ucs') ? 'ucs'
      : algo.toLowerCase().includes('greedy') ? 'greedy'
      : 'aStar';

    if (comparisonData?.detailedResults?.[algoKey]) {
      const detailed = comparisonData.detailedResults[algoKey];
      setSearchResult({
        ...detailed,
        enrichedPath: detailed.path.map(id => graphData?.nodes?.find(n => n.id === id) || id)
      });
    }
    setAlgorithm(algo);
    document.getElementById('search-visualizer-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in">
      {/* Top Banner */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', background: 'rgba(2, 132, 199, 0.12)', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px' }}>
          ACADEMIC VIVA & EVALUATION SUITE
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '6px' }}>AI Lab Search Algorithms Demonstration</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Real-time interactive traversal: Uninformed (BFS, DFS, UCS) & Informed Search (Greedy Best-First, A*)
        </p>
      </div>

      {/* Control Console (Responsive 3-Column Dropdowns, Auto-updating without manual button) */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Start State (Origin):
            </label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                fontWeight: 600
              }}
            >
              {startCandidates.map(n => (
                <option key={n.id} value={n.id}>
                  [{n.type}] {n.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Goal State (Destination):
            </label>
            <select
              value={goalNode}
              onChange={(e) => setGoalNode(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                fontWeight: 600
              }}
            >
              {goalCandidates.map(n => (
                <option key={n.id} value={n.id}>
                  [{n.type}] {n.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Active Search Algorithm:
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="BFS">Breadth-First Search (BFS)</option>
              <option value="DFS">Depth-First Search (DFS)</option>
              <option value="UCS">Uniform Cost Search (UCS)</option>
              <option value="Greedy">Greedy Best-First Search</option>
              <option value="A*">A* Search [f(n) = g(n) + h(n)]</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visualizer */}
      {searchResult && (
        <CareerSearchVisualizer
          searchResult={searchResult}
          selectedAlgorithm={algorithm}
          onAlgorithmChange={(newAlgo) => setAlgorithm(newAlgo)}
        />
      )}

      {/* Comparison Matrix */}
      {comparisonData && (
        <AlgorithmComparisonTable
          comparisonData={comparisonData}
          currentAlgo={algorithm}
          onSelectAlgorithm={handleInspectAlgorithm}
        />
      )}

      {/* Important Concepts (Renamed as requested) */}
      <div style={{ marginTop: '36px' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Important Concepts</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Uninformed Search</span>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>BFS (Breadth-First Search)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Uses a FIFO Queue. Discovers the path with minimum transitions. Unaware of learning curve or edge weights.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Uninformed Search</span>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>DFS (Depth-First Search)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Uses a LIFO Stack / recursion. Explores one branch deeply before backtracking. Can get stuck in long paths.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Uninformed Search</span>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>UCS (Uniform Cost Search)</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Uses a Min-Priority Queue on cumulative cost g(n). Guaranteed to find path of lowest preparation effort.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Informed Search</span>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Greedy Best-First Search</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Evaluation function: f(n) = h(n). Expands the node that appears closest to the career destination.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Informed Search</span>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>A* Search</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Evaluation function: f(n) = g(n) + h(n). Balances accumulated path effort g(n) with admissible heuristic h(n).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AILabDemonstration;
