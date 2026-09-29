import React, { useState } from 'react';

// Reliable algorithm matcher
function isSameAlgorithm(algo1, algo2) {
  if (!algo1 || !algo2) return false;
  const a = algo1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const b = algo2.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (a === b) return true;
  if (a.includes('greedy') && b.includes('greedy')) return true;
  if (a.includes('bfs') && b.includes('bfs')) return true;
  if (a.includes('dfs') && b.includes('dfs')) return true;
  if (a.includes('ucs') && b.includes('ucs')) return true;
  if ((a.includes('astar') || a === 'a') && (b.includes('astar') || b === 'a')) return true;
  return false;
}

export function CareerSearchVisualizer({ searchResult, selectedAlgorithm, onAlgorithmChange }) {
  const [activeStepIndex, setActiveStepIndex] = useState(null);

  if (!searchResult) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Select a Course and Target Job Role to execute search algorithms.
      </div>
    );
  }

  const { path, pathCost, pathLength, nodesExploredCount, searchOrder, algorithm, searchType, enrichedPath } = searchResult;

  const getAlgoExplanation = (algo) => {
    const a = (algo || '').toLowerCase();
    if (a.includes('bfs')) {
      return {
        concept: 'Breadth-First Search (BFS)',
        type: 'Uninformed Search',
        strategy: 'Explores level-by-level using a FIFO Queue. It discovers the shortest career pathway in terms of transition hops, irrespective of difficulty weights.',
        tip: 'Guaranteed complete and optimal for unweighted graphs. Time Complexity: O(b^d), Space Complexity: O(b^d).'
      };
    }
    if (a.includes('dfs')) {
      return {
        concept: 'Depth-First Search (DFS)',
        type: 'Uninformed Search',
        strategy: 'Follows one prerequisite chain deeply to its frontier before backtracking using a LIFO Stack. Useful for tracing deep vertical specializations.',
        tip: 'Space Complexity: O(b*m). Not guaranteed to find the shortest path or optimal cost, and can get trapped in deep subgraphs.'
      };
    }
    if (a.includes('ucs')) {
      return {
        concept: 'Uniform Cost Search (UCS)',
        type: 'Uninformed Search',
        strategy: 'Expands the frontier node with lowest accumulated cost g(n) using a Min-Priority Queue. Guarantees finding the path of minimum preparation effort.',
        tip: 'Optimal and complete if edge costs are >= epsilon > 0. Equivalent to Dijkstra\'s algorithm.'
      };
    }
    if (a.includes('greedy')) {
      return {
        concept: 'Greedy Best-First Search',
        type: 'Informed Search',
        strategy: 'Heuristic-guided search expanding node with minimum h(n). Aggressively drives toward the career destination node that appears closest.',
        tip: 'Fast in practice, but not guaranteed optimal because it ignores cumulative path cost g(n).'
      };
    }
    return {
      concept: 'A* Search (Optimal Informed Search)',
      type: 'Informed Search',
      strategy: 'Combines actual path cost g(n) with admissible heuristic estimate h(n): f(n) = g(n) + h(n). Balances past effort with future goal distance.',
      tip: 'Guaranteed optimal and complete when h(n) is admissible (never overestimates) and consistent. Most efficient informed search algorithm.'
    };
  };

  const info = getAlgoExplanation(algorithm);

  // Group nodes into serpentine rows (3 nodes per row)
  const allNodes = enrichedPath || path || [];
  const CHUNK_SIZE = 3;
  const rows = [];
  for (let i = 0; i < allNodes.length; i += CHUNK_SIZE) {
    rows.push({
      rowIndex: Math.floor(i / CHUNK_SIZE),
      nodes: allNodes.slice(i, i + CHUNK_SIZE),
      startIndex: i
    });
  }

  return (
    <div id="search-visualizer-section" className="glass-panel" style={{ padding: '28px', marginTop: '24px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.4rem' }}>{algorithm} Career Pathway</h3>
            <span className={`badge ${searchType && searchType.includes('Informed') ? 'badge-cyan' : 'badge-primary'}`}>
              {searchType}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Path Cost: <strong style={{ color: 'var(--accent-amber)' }}>{pathCost} units</strong> | 
            Transitions: <strong>{pathLength - 1} hops</strong> | 
            Explored: <strong>{nodesExploredCount} nodes</strong>
          </p>
        </div>

        {/* Algorithm Switcher */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(100, 116, 139, 0.1)', padding: '6px', borderRadius: 'var(--radius-md)' }}>
          {['BFS', 'DFS', 'UCS', 'Greedy', 'A*'].map(algo => {
            const isCurrent = isSameAlgorithm(algorithm, algo);
            return (
              <button
                key={algo}
                className={`btn ${isCurrent ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => onAlgorithmChange && onAlgorithmChange(algo)}
              >
                {algo}
              </button>
            );
          })}
        </div>
      </div>

      {/* SERPENTINE / ZIGZAG FLOWCHART */}
      <div style={{ marginBottom: '28px' }}>
        <h4 style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Algorithmic Solution Pathway Flow:
        </h4>

        <div className="serpentine-container">
          {rows.map((rowObj, rIdx) => {
            const isEvenRow = rIdx % 2 === 0; // 0, 2 -> Left to Right; 1 -> Right to Left
            const hasNextRow = rIdx < rows.length - 1;

            return (
              <React.Fragment key={rIdx}>
                {/* Row of Nodes */}
                <div className={`serpentine-row ${isEvenRow ? 'flow-ltr' : 'flow-rtl'}`}>
                  {rowObj.nodes.map((node, nIdx) => {
                    const globalIdx = rowObj.startIndex + nIdx;
                    const isObj = typeof node === 'object' && node !== null;
                    const label = isObj ? node.label : node;
                    const type = isObj ? node.type : 'NODE';
                    const isFirst = globalIdx === 0;
                    const isLast = globalIdx === allNodes.length - 1;
                    const isEndOfRow = nIdx === rowObj.nodes.length - 1;

                    return (
                      <React.Fragment key={globalIdx}>
                        <div
                          className={`serpentine-card ${isFirst ? 'node-start' : isLast ? 'node-goal' : ''}`}
                        >
                          <span style={{
                            fontSize: '0.72rem',
                            color: isFirst ? 'var(--primary)' : isLast ? 'var(--accent-emerald)' : 'var(--text-dim)',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            marginBottom: '4px',
                            letterSpacing: '0.04em'
                          }}>
                            {isFirst ? 'START: COURSE' : isLast ? 'TARGET: GOAL ROLE' : type}
                          </span>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--node-text)', lineHeight: '1.3' }}>
                            {label}
                          </span>
                        </div>

                        {/* Horizontal Arrow between cards in the row */}
                        {!isEndOfRow && (
                          <div className="flow-connector-horizontal">
                            {isEvenRow ? '➔' : '⬅'}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Serpentine Down Turn Connector (SHOW ONLY THE DOWN ARROW as requested) */}
                {hasNextRow && (
                  <div className={`flow-turn-down ${isEvenRow ? 'turn-right' : 'turn-left'}`} style={{ margin: '8px 0' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.1)',
                      border: '2px solid var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
                    }} title="Path continues on next line">
                      ↓
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Important Concept Box */}
      <div style={{
        background: 'rgba(37, 99, 235, 0.08)',
        border: '1.5px solid rgba(37, 99, 235, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '18px 22px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.1rem' }}>🎓</span>
          <strong style={{ fontSize: '0.96rem', color: 'var(--primary)' }}>
            Important Concept: {info.concept}
          </strong>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.5' }}>
          {info.strategy}
        </p>
        <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
          💡 {info.tip}
        </div>
      </div>

      {/* High-Contrast Exploration Sequence */}
      {searchOrder && searchOrder.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Exploration Sequence ({searchOrder.length} expansion steps):
          </h4>
          <div className="exploration-sequence-box">
            {searchOrder.map((step, idx) => {
              const isGoal = step.action === 'GOAL_FOUND';
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx === activeStepIndex ? null : idx)}
                  className={`exploration-step-chip ${isGoal ? 'chip-goal' : ''}`}
                  title={step.formula || `Step ${step.step}: ${step.node}`}
                >
                  #{step.step} {step.node.replace('COURSE_', '').replace('SKILL_', '').replace('TOPIC_', '').replace('ROLE_', '')}
                  {step.f !== undefined && ` (f=${step.f})`}
                  {step.g !== undefined && step.f === undefined && ` (g=${step.g})`}
                  {step.h !== undefined && step.g === undefined && ` (h=${step.h})`}
                </div>
              );
            })}
          </div>
          {activeStepIndex !== null && searchOrder[activeStepIndex] && (
            <div style={{ marginTop: '10px', fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600 }}>
              Step #{searchOrder[activeStepIndex].step} Details: Node <strong>{searchOrder[activeStepIndex].node}</strong> | 
              Formula: <code>{searchOrder[activeStepIndex].formula || 'Standard Expansion'}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CareerSearchVisualizer;
