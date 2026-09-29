import React from 'react';

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

export function AlgorithmComparisonTable({ comparisonData, onSelectAlgorithm, currentAlgo }) {
  if (!comparisonData || !comparisonData.comparisonTable) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>AI Lab Search Algorithms Benchmark Matrix</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time execution across unweighted, cost-based, and heuristic-guided graph traversals
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 14px' }}>Algorithm</th>
              <th style={{ padding: '12px 14px' }}>Search Class</th>
              <th style={{ padding: '12px 14px' }}>Evaluation Metric / Formula</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Path Length</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Path Cost g(n)</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Nodes Explored</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Heuristic h(n)</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.comparisonTable.map((row, idx) => {
              const isSelected = isSameAlgorithm(currentAlgo, row.algorithm);
              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: row.usesHeuristic === 'Yes' ? 'var(--accent-cyan)' : 'var(--primary)'
                      }} />
                      {row.algorithm}
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge ${row.searchType.includes('Informed') ? 'badge-cyan' : 'badge-primary'}`}>
                      {row.searchType}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {row.formula}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center', fontWeight: 700, color: 'var(--text-main)' }}>
                    {row.pathLength} nodes
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    {row.pathCost}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(100, 116, 139, 0.1)',
                      fontWeight: 800,
                      color: 'var(--text-main)'
                    }}>
                      {row.nodesExploredCount}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {row.usesHeuristic === 'Yes' ? (
                      <span className="badge badge-emerald">Active</span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>None</span>
                    )}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      type="button"
                      onClick={() => onSelectAlgorithm && onSelectAlgorithm(row.algorithm)}
                    >
                      {isSelected ? '✓ Viewing' : 'Inspect Path'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlgorithmComparisonTable;
