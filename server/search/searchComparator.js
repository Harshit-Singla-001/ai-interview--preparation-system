import { breadthFirstSearch } from './bfs.js';
import { depthFirstSearch } from './dfs.js';
import { uniformCostSearch } from './uniformCostSearch.js';
import { greedyBestFirstSearch } from './greedyBestFirst.js';
import { aStarSearch } from './aStar.js';
import { HeuristicCalculator } from './heuristic.js';

export function compareSearchAlgorithms(graph, startId, goalId) {
  const heuristicCalc = new HeuristicCalculator(graph);

  const bfsRes = breadthFirstSearch(graph, startId, goalId);
  const dfsRes = depthFirstSearch(graph, startId, goalId);
  const ucsRes = uniformCostSearch(graph, startId, goalId);
  const greedyRes = greedyBestFirstSearch(graph, startId, goalId, heuristicCalc);
  const aStarRes = aStarSearch(graph, startId, goalId, heuristicCalc);

  const formatSummary = (res, usesHeuristic, formula) => ({
    algorithm: res.algorithm,
    searchType: res.searchType,
    success: res.success,
    pathFound: res.path,
    pathLength: res.pathLength,
    pathCost: res.pathCost,
    nodesExploredCount: res.nodesExploredCount,
    usesHeuristic,
    formula,
    executionTimeMs: res.executionTimeMs
  });

  return {
    startNode: startId,
    goalNode: goalId,
    comparisonTable: [
      formatSummary(bfsRes, 'No', 'FIFO Queue Level-by-Level'),
      formatSummary(dfsRes, 'No', 'LIFO Stack Depth-First'),
      formatSummary(ucsRes, 'No', 'Min g(n) Accumulated Cost'),
      formatSummary(greedyRes, 'Yes', 'f(n) = h(n) Estimated Distance'),
      formatSummary(aStarRes, 'Yes', 'f(n) = g(n) + h(n) Optimal Balance')
    ],
    detailedResults: {
      bfs: bfsRes,
      dfs: dfsRes,
      ucs: ucsRes,
      greedy: greedyRes,
      aStar: aStarRes
    }
  };
}

export default compareSearchAlgorithms;
