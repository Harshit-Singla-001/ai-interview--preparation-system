import { PriorityQueue } from './priorityQueue.js';

/**
 * Greedy Best-First Search
 * Search Type: Informed Search
 * Evaluation Function: f(n) = h(n)
 * 
 * Expands the node that appears closest to the target goal role according to the heuristic.
 */
export function greedyBestFirstSearch(graph, startId, goalId, heuristicCalculator) {
  const startTime = process.hrtime.bigint();

  if (!graph.hasNode(startId) || !graph.hasNode(goalId)) {
    return {
      algorithm: 'Greedy Best-First',
      searchType: 'Informed Search',
      success: false,
      error: 'Invalid start or goal node',
      path: [],
      pathCost: 0,
      pathLength: 0,
      nodesExploredCount: 0,
      nodesExplored: [],
      searchOrder: []
    };
  }

  // Priority queue ordered by h(n)
  const pq = new PriorityQueue((a, b) => a.h - b.h);
  const initialH = heuristicCalculator.getH(startId, goalId);
  pq.push({ id: startId, h: initialH });

  const visited = new Set();
  const parentMap = new Map();
  const searchOrder = [];
  const nodesExplored = [];

  let step = 0;
  let found = false;

  while (!pq.isEmpty()) {
    const current = pq.pop();

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    step++;
    nodesExplored.push(current.id);

    searchOrder.push({
      step,
      node: current.id,
      h: current.h,
      formula: `f(n) = h(n) = ${current.h}`,
      action: current.id === goalId ? 'GOAL_FOUND' : 'EXPAND',
      priorityQueueSize: pq.size()
    });

    if (current.id === goalId) {
      found = true;
      break;
    }

    const neighbors = graph.getNeighbors(current.id);
    for (const edge of neighbors) {
      if (!visited.has(edge.to)) {
        if (!parentMap.has(edge.to)) {
          parentMap.set(edge.to, current.id);
        }
        const h = heuristicCalculator.getH(edge.to, goalId);
        pq.push({ id: edge.to, h });
      }
    }
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  if (!found) {
    return {
      algorithm: 'Greedy Best-First',
      searchType: 'Informed Search',
      success: false,
      message: 'No path exists between start and goal',
      path: [],
      pathCost: 0,
      pathLength: 0,
      nodesExploredCount: nodesExplored.length,
      nodesExplored,
      searchOrder,
      executionTimeMs
    };
  }

  const path = graph.reconstructPath(parentMap, goalId);
  const pathCost = graph.computePathCost(path);

  return {
    algorithm: 'Greedy Best-First',
    searchType: 'Informed Search',
    success: true,
    startNode: startId,
    goalNode: goalId,
    path,
    pathCost,
    pathLength: path.length,
    nodesExploredCount: nodesExplored.length,
    nodesExplored,
    searchOrder,
    executionTimeMs
  };
}

export default greedyBestFirstSearch;
