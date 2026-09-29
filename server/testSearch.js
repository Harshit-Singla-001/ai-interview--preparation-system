import { CareerGraph } from './search/graph.js';
import { HeuristicCalculator } from './search/heuristic.js';
import { breadthFirstSearch } from './search/bfs.js';
import { depthFirstSearch } from './search/dfs.js';
import { uniformCostSearch } from './search/uniformCostSearch.js';
import { greedyBestFirstSearch } from './search/greedyBestFirst.js';
import { aStarSearch } from './search/aStar.js';
import { compareSearchAlgorithms } from './search/searchComparator.js';

console.log('====================================================');
console.log(' AI LAB SEARCH ALGORITHM VERIFICATION SUITE');
console.log('====================================================\n');

const graph = new CareerGraph();
const heuristicCalc = new HeuristicCalculator(graph);

const startNode = 'COURSE_BTECH_AIDS';
const goalNode = 'ROLE_DATA_SCIENTIST';

console.log(`Testing Start Node: ${startNode} -> Goal Node: ${goalNode}`);
console.log(`Start Node Details:`, graph.getNode(startNode));
console.log(`Goal Node Details:`, graph.getNode(goalNode));
console.log('----------------------------------------------------\n');

// 1. BFS Test
console.log('--- 1. Breadth-First Search (BFS) ---');
const bfsResult = breadthFirstSearch(graph, startNode, goalNode);
console.log(`Success: ${bfsResult.success}`);
console.log(`Path (${bfsResult.pathLength} nodes): ${bfsResult.path.join(' -> ')}`);
console.log(`Path Cost: ${bfsResult.pathCost}`);
console.log(`Nodes Explored: ${bfsResult.nodesExploredCount}`);
console.log(`Search Order Steps: ${bfsResult.searchOrder.length}`);
console.log('');

// 2. DFS Test
console.log('--- 2. Depth-First Search (DFS) ---');
const dfsResult = depthFirstSearch(graph, startNode, goalNode);
console.log(`Success: ${dfsResult.success}`);
console.log(`Path (${dfsResult.pathLength} nodes): ${dfsResult.path.join(' -> ')}`);
console.log(`Path Cost: ${dfsResult.pathCost}`);
console.log(`Nodes Explored: ${dfsResult.nodesExploredCount}`);
console.log('');

// 3. UCS Test
console.log('--- 3. Uniform Cost Search (UCS) ---');
const ucsResult = uniformCostSearch(graph, startNode, goalNode);
console.log(`Success: ${ucsResult.success}`);
console.log(`Path (${ucsResult.pathLength} nodes): ${ucsResult.path.join(' -> ')}`);
console.log(`Path Cost: ${ucsResult.pathCost}`);
console.log(`Nodes Explored: ${ucsResult.nodesExploredCount}`);
console.log('');

// 4. Greedy Best-First Test
console.log('--- 4. Greedy Best-First Search ---');
const greedyResult = greedyBestFirstSearch(graph, startNode, goalNode, heuristicCalc);
console.log(`Success: ${greedyResult.success}`);
console.log(`Path (${greedyResult.pathLength} nodes): ${greedyResult.path.join(' -> ')}`);
console.log(`Path Cost: ${greedyResult.pathCost}`);
console.log(`Nodes Explored: ${greedyResult.nodesExploredCount}`);
console.log('');

// 5. A* Search Test
console.log('--- 5. A* Search (f(n) = g(n) + h(n)) ---');
const aStarResult = aStarSearch(graph, startNode, goalNode, heuristicCalc);
console.log(`Success: ${aStarResult.success}`);
console.log(`Path (${aStarResult.pathLength} nodes): ${aStarResult.path.join(' -> ')}`);
console.log(`Path Cost: ${aStarResult.pathCost}`);
console.log(`Nodes Explored: ${aStarResult.nodesExploredCount}`);
console.log('');

// 6. Algorithm Comparison Table
console.log('====================================================');
console.log(' COMPARATIVE SEARCH BENCHMARK MATRIX');
console.log('====================================================');
const comparison = compareSearchAlgorithms(graph, startNode, goalNode);
console.table(comparison.comparisonTable);

// 7. Edge Cases Verification
console.log('\n--- 7. Edge Case Testing ---');
const invalidResult = aStarSearch(graph, 'NON_EXISTENT_COURSE', goalNode, heuristicCalc);
console.log(`Invalid Start Node Handled Gracefully: ${!invalidResult.success} (Error: "${invalidResult.error}")`);

const sameNodeResult = breadthFirstSearch(graph, startNode, startNode);
console.log(`Start == Goal Handled: ${sameNodeResult.success} (Path: [${sameNodeResult.path.join(', ')}])`);

console.log('\nAll search algorithm tests executed successfully!');
