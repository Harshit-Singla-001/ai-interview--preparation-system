import { PriorityQueue } from './priorityQueue.js';

/**
 * A* Search Algorithm
 * Search Type: Informed Search
 * Evaluation Function: f(n) = g(n) + h(n)
 * 
 * g(n) = Exact accumulated cost from start node to node n
 * h(n) = Admissible estimated cost from node n to goal
 * f(n) = Estimated total cost through node n
 * 
 * Balances path cost already incurred with heuristic distance to destination.
 * Guarantees optimal path when heuristic is admissible and consistent.
 */
export function aStarSearch(graph, startId, goalId, heuristicCalculator) {
  const startTime = process.hrtime.bigint();

  if (!graph.hasNode(startId) || !graph.hasNode(goalId)) {
    return {
      algorithm: 'A*',
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

  // Priority queue ordered by f(n), tie-breaking by lower h(n)
  const pq = new PriorityQueue((a, b) => {
    if (a.f === b.f) return a.h - b.h;
    return a.f - b.f;
  });

  const gScore = new Map();
  gScore.set(startId, 0);

  const initialH = heuristicCalculator.getH(startId, goalId);
  pq.push({ id: startId, g: 0, h: initialH, f: 0 + initialH });

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
      g: current.g,
      h: current.h,
      f: current.f,
      formula: `f(n) = g(${current.g}) + h(${current.h}) = ${current.f}`,
      action: current.id === goalId ? 'GOAL_FOUND' : 'EXPAND',
      priorityQueueSize: pq.size()
    });

    if (current.id === goalId) {
      found = true;
      break;
    }

    const neighbors = graph.getNeighbors(current.id);
    for (const edge of neighbors) {
      const tentativeG = current.g + edge.cost;
      const prevG = gScore.get(edge.to);

      if (prevG === undefined || tentativeG < prevG) {
        gScore.set(edge.to, tentativeG);
        parentMap.set(edge.to, current.id);

        const h = heuristicCalculator.getH(edge.to, goalId);
        const f = tentativeG + h;
        pq.push({ id: edge.to, g: tentativeG, h, f });
      }
    }
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  if (!found) {
    return {
      algorithm: 'A*',
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
  const pathCost = gScore.get(goalId) || graph.computePathCost(path);

  return {
    algorithm: 'A*',
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

export default aStarSearch;
