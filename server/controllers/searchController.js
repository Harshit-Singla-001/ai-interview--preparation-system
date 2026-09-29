import { CareerGraph } from '../search/graph.js';
import { HeuristicCalculator } from '../search/heuristic.js';
import { breadthFirstSearch } from '../search/bfs.js';
import { depthFirstSearch } from '../search/dfs.js';
import { uniformCostSearch } from '../search/uniformCostSearch.js';
import { greedyBestFirstSearch } from '../search/greedyBestFirst.js';
import { aStarSearch } from '../search/aStar.js';
import { compareSearchAlgorithms } from '../search/searchComparator.js';

const graph = new CareerGraph();
const heuristicCalc = new HeuristicCalculator(graph);

export const runSearch = (req, res) => {
  const { startNode, goalNode, algorithm } = req.body;

  if (!startNode || !goalNode) {
    return res.status(400).json({
      success: false,
      message: 'Both startNode and goalNode are required'
    });
  }

  if (!graph.hasNode(startNode)) {
    return res.status(400).json({ success: false, message: `Start node "${startNode}" does not exist in graph` });
  }

  if (!graph.hasNode(goalNode)) {
    return res.status(400).json({ success: false, message: `Goal node "${goalNode}" does not exist in graph` });
  }

  const algoLower = (algorithm || 'astar').toLowerCase().replace(/[\s\-_]/g, '');

  let result;
  switch (algoLower) {
    case 'bfs':
    case 'breadthfirst':
    case 'breadthfirstsearch':
      result = breadthFirstSearch(graph, startNode, goalNode);
      break;

    case 'dfs':
    case 'depthfirst':
    case 'depthfirstsearch':
      result = depthFirstSearch(graph, startNode, goalNode);
      break;

    case 'ucs':
    case 'uniformcost':
    case 'uniformcostsearch':
      result = uniformCostSearch(graph, startNode, goalNode);
      break;

    case 'greedy':
    case 'greedybestfirst':
    case 'greedybestfirstsearch':
      result = greedyBestFirstSearch(graph, startNode, goalNode, heuristicCalc);
      break;

    case 'astar':
    case 'a*':
    default:
      result = aStarSearch(graph, startNode, goalNode, heuristicCalc);
      break;
  }

  // Enrich path with node metadata
  const enrichedPath = result.path.map(nodeId => graph.getNode(nodeId));

  res.json({
    success: result.success,
    data: {
      ...result,
      enrichedPath
    }
  });
};

export const compareSearch = (req, res) => {
  const { startNode, goalNode } = req.body;

  if (!startNode || !goalNode) {
    return res.status(400).json({
      success: false,
      message: 'Both startNode and goalNode are required for algorithm comparison'
    });
  }

  if (!graph.hasNode(startNode) || !graph.hasNode(goalNode)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid startNode or goalNode specified'
    });
  }

  const comparison = compareSearchAlgorithms(graph, startNode, goalNode);

  res.json({
    success: true,
    data: comparison
  });
};
