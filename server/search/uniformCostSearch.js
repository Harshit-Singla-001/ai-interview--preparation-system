import { PriorityQueue } from './priorityQueue.js';

/**
 * Uniform Cost Search (UCS)
 * Search Type: Uninformed Search
 * 
 * Expands the node with the lowest cumulative path cost g(n).
 * Guarantees optimal path cost on non-negative weighted graphs (Dijkstra's equivalent).
 */
export function uniformCostSearch(graph, startId, goalId) {
  const startTime = process.hrtime.bigint();

  if (!graph.hasNode(startId) || !graph.hasNode(goalId)) {
    return {
      algorithm: 'UCS',
      searchType: 'Uninformed Search',
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

  // Priority queue ordered by g(n) (cumulative cost)
  const pq = new PriorityQueue((a, b) => a.cost - b.cost);
  pq.push({ id: startId, cost: 0 });

  const costSoFar = new Map();
  costSoFar.set(startId, 0);

  const parentMap = new Map();
  const visited = new Set();
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
      g: current.cost,
      action: current.id === goalId ? 'GOAL_FOUND' : 'EXPAND',
      priorityQueueSize: pq.size()
    });

    if (current.id === goalId) {
      found = true;
      break;
    }

    const neighbors = graph.getNeighbors(current.id);
    for (const edge of neighbors) {
      const newCost = current.cost + edge.cost;
      const prevCost = costSoFar.get(edge.to);

      if (prevCost === undefined || newCost < prevCost) {
        costSoFar.set(edge.to, newCost);
        parentMap.set(edge.to, current.id);
        pq.push({ id: edge.to, cost: newCost });
      }
    }
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  if (!found) {
    return {
      algorithm: 'UCS',
      searchType: 'Uninformed Search',
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
  const pathCost = costSoFar.get(goalId) || graph.computePathCost(path);

  return {
    algorithm: 'UCS',
    searchType: 'Uninformed Search',
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

export default uniformCostSearch;
