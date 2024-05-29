const turf = require('@turf/turf');
const { Graph, alg } = require('graphlib');
const fs = require('fs');

// Load and parse GeoJSON data
const loadGeoJSON = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Convert GeoJSON point to a string key for graph nodes
const pointToKey = (point) => {
  return `${point[0]},${point[1]}`;
};

// Convert a string key back to GeoJSON point
const keyToPoint = (key) => {
  const [lng, lat] = key.split(',').map(Number);
  return [lng, lat];
};

// Create a graph from the cost surface
const createGraphFromCostSurface = (costSurface) => {
  const graph = new Graph({ directed: true });
  const rows = costSurface.length;
  const cols = costSurface[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const point = [col, row];
      const key = pointToKey(point);
      graph.setNode(key, costSurface[row][col]);

      // Add edges to neighboring cells
      const neighbors = [
        [col + 1, row],
        [col - 1, row],
        [col, row + 1],
        [col, row - 1],
      ];

      neighbors.forEach(([nCol, nRow]) => {
        if (nCol >= 0 && nCol < cols && nRow >= 0 && nRow < rows) {
          const neighborKey = pointToKey([nCol, nRow]);
          graph.setEdge(key, neighborKey, costSurface[nRow][nCol]);
        }
      });
    }
  }

  return graph;
};

// Find the shortest path using Dijkstra's algorithm
const findShortestPath = (graph, start, end) => {
  const startKey = pointToKey(start);
  const endKey = pointToKey(end);
  const path = alg.dijkstra(graph, startKey);

  if (!path[endKey]) {
    throw new Error('No path found');
  }

  const resultPath = [];
  let currentKey = endKey;

  while (currentKey !== startKey) {
    resultPath.unshift(keyToPoint(currentKey));
    currentKey = path[currentKey].predecessor;
  }

  resultPath.unshift(start);
  return resultPath;
};

const createOptimizedRoute = (wellLocation, manifoldLocation, costSurfacePath) => {
  const costSurface = loadGeoJSON(costSurfacePath).features.map((feature) => feature.properties.cost);
  const graph = createGraphFromCostSurface(costSurface);
  return findShortestPath(graph, wellLocation, manifoldLocation);
};

module.exports = {
  createOptimizedRoute,
};
