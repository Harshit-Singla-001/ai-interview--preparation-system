import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CareerGraph {
  constructor(dataPath) {
    const resolvedPath = dataPath || path.join(__dirname, '../data/careerGraph.json');
    const raw = fs.readFileSync(resolvedPath, 'utf8');
    const data = JSON.parse(raw);

    this.nodes = new Map();
    this.adjacency = new Map(); // nodeId -> Array of { to, cost, relation }
    this.reverseAdjacency = new Map(); // nodeId -> Array of { from, cost, relation }

    data.nodes.forEach(node => {
      this.nodes.set(node.id, node);
      this.adjacency.set(node.id, []);
      this.reverseAdjacency.set(node.id, []);
    });

    data.edges.forEach(edge => {
      if (this.nodes.has(edge.from) && this.nodes.has(edge.to)) {
        this.adjacency.get(edge.from).push({
          to: edge.to,
          cost: edge.cost || 1,
          relation: edge.relation || 'TRANSITION'
        });
        this.reverseAdjacency.get(edge.to).push({
          from: edge.from,
          cost: edge.cost || 1,
          relation: edge.relation || 'TRANSITION'
        });
      }
    });
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  hasNode(id) {
    return this.nodes.has(id);
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  getNeighbors(id) {
    return this.adjacency.get(id) || [];
  }

  getIncoming(id) {
    return this.reverseAdjacency.get(id) || [];
  }

  /**
   * Reconstruct path from start to goal given parent map
   */
  reconstructPath(parentMap, goalId) {
    const path = [];
    let current = goalId;
    while (current) {
      path.unshift(current);
      current = parentMap.get(current);
    }
    return path;
  }

  /**
   * Compute actual cumulative cost of a given path
   */
  computePathCost(path) {
    if (!path || path.length < 2) return 0;
    let totalCost = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const edge = (this.adjacency.get(from) || []).find(e => e.to === to);
      totalCost += edge ? edge.cost : 1;
    }
    return totalCost;
  }
}

export default CareerGraph;
