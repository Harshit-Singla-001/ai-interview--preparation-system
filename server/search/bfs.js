/**
 * Breadth-First Search (BFS)
 * Search Type: Uninformed Search
 * 
 * Explores the career knowledge graph level by level using a FIFO Queue.
 * Guarantees finding the path with the minimum number of transitions (hops).
 */
export function breadthFirstSearch(graph, startId, goalId) {
  const startTime = process.hrtime.bigint();

  if (!graph.hasNode(startId) || !graph.hasNode(goalId)) {
    return {
      algorithm: 'BFS',
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
      algorithm: 'BFS',
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

  const queue = [startId];
  const visited = new Set([startId]);
  const parentMap = new Map();
  const searchOrder = [];
  const nodesExplored = [];

  let step = 0;
  let found = false;

  while (queue.length > 0) {
    const current = queue.shift();
    step++;
    nodesExplored.push(current);

    searchOrder.push({
      step,
      node: current,
      action: current === goalId ? 'GOAL_FOUND' : 'EXPAND',
      queueSnapshot: [...queue]
    });

    if (current === goalId) {
      found = true;
      break;
    }

    const neighbors = graph.getNeighbors(current);
    for (const edge of neighbors) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        parentMap.set(edge.to, current);
        queue.push(edge.to);
      }
    }
  }

  const endTime = process.hrtime.bigint();
  const executionTimeMs = Number(endTime - startTime) / 1e6;

  if (!found) {
    return {
      algorithm: 'BFS',
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
    algorithm: 'BFS',
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

export default breadthFirstSearch;
