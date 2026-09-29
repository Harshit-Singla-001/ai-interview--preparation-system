/**
 * Depth-First Search (DFS)
 * Search Type: Uninformed Search
 * 
 * Explores one branch deeply before backtracking using a LIFO Stack.
 * Demonstrates deep-dive traversal into specific prerequisite specializations.
 */
export function depthFirstSearch(graph, startId, goalId) {
  const startTime = process.hrtime.bigint();

  if (!graph.hasNode(startId) || !graph.hasNode(goalId)) {
    return {
      algorithm: 'DFS',
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

  if (startId === goalId) {
    return {
      algorithm: 'DFS',
      searchType: 'Uninformed Search',
      success: true,
      path: [startId],
      pathCost: 0,
      pathLength: 1,
      nodesExploredCount: 1,
      nodesExplored: [startId],
      searchOrder: [{ step: 1, node: startId, action: 'GOAL_FOUND' }]
    };
  }

  const stack = [startId];
  const visited = new Set();
  const parentMap = new Map();
  const searchOrder = [];
  const nodesExplored = [];

  let step = 0;
  let found = false;

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) continue;
    visited.add(current);

    step++;
    nodesExplored.push(current);

    searchOrder.push({
      step,
      node: current,
      action: current === goalId ? 'GOAL_FOUND' : 'EXPAND',
      stackSnapshot: [...stack]
    });

    if (current === goalId) {
      found = true;
      break;
    }

    const neighbors = graph.getNeighbors(current);
    // Reverse neighbors so leftmost is expanded first on stack
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const edge = neighbors[i];
      if (!visited.has(edge.to)) {
        if (!parentMap.has(edge.to)) {
          parentMap.set(edge.to, current);
        }
        stack.push(edge.to);
      }
    }
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  if (!found) {
    return {
      algorithm: 'DFS',
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
  const pathCost = graph.computePathCost(path);

  return {
    algorithm: 'DFS',
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

export default depthFirstSearch;
