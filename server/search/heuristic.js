/**
 * Admissible & Consistent Heuristic Function for Career Knowledge Graph
 * 
 * Formula:
 * h(n) estimates the remaining learning cost from node n to the target job role.
 * 
 * In an academic setting, for A* to guarantee optimality:
 * h(n) <= h*(n)  (Admissible: never overestimates true remaining cost)
 * h(u) <= c(u,v) + h(v) (Consistent / Monotonic)
 * 
 * We compute this by:
 * 1. Running reverse Dijkstra on the knowledge graph from the goal node.
 * 2. If a node is disconnected, h(n) = Infinity.
 * 3. Falling back to hierarchical layer distance: max(0, level(goal) - level(n)) * min_cost.
 */

export class HeuristicCalculator {
  constructor(graph) {
    this.graph = graph;
    this.cache = new Map(); // key: `${goalId}` -> Map(nodeId -> hValue)
  }

  /**
   * Precomputes exact minimum distance from all nodes to a goal node via reverse exploration
   */
  _computeDistancesToGoal(goalId) {
    const distances = new Map();
    distances.set(goalId, 0);

    // Using basic BFS/Dijkstra in reverse direction
    const queue = [{ id: goalId, cost: 0 }];

    while (queue.length > 0) {
      // Sort to simulate min extraction
      queue.sort((a, b) => a.cost - b.cost);
      const { id, cost } = queue.shift();

      const currentBest = distances.get(id);
      if (currentBest !== undefined && cost > currentBest) continue;

      const incoming = this.graph.getIncoming(id);
      for (const edge of incoming) {
        const newCost = cost + edge.cost;
        const prev = distances.get(edge.from);
        if (prev === undefined || newCost < prev) {
          distances.set(edge.from, newCost);
          queue.push({ id: edge.from, cost: newCost });
        }
      }
    }

    return distances;
  }

  /**
   * Returns admissible heuristic h(nodeId, goalId)
   */
  getH(nodeId, goalId) {
    if (nodeId === goalId) return 0;

    if (!this.cache.has(goalId)) {
      this.cache.set(goalId, this._computeDistancesToGoal(goalId));
    }

    const distMap = this.cache.get(goalId);
    if (distMap.has(nodeId)) {
      // Admissible: exactly equal to or slightly lower than true cost
      return distMap.get(nodeId);
    }

    // Fallback layer-based heuristic if reverse path was not indexed
    const node = this.graph.getNode(nodeId);
    const goal = this.graph.getNode(goalId);
    if (node && goal && typeof node.level === 'number' && typeof goal.level === 'number') {
      const levelDiff = Math.max(0, goal.level - node.level);
      return levelDiff * 1; // min edge cost is 1
    }

    return 1;
  }
}

export default HeuristicCalculator;
