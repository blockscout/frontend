/* eslint-disable @typescript-eslint/no-unused-vars */
import Cytoscape from 'cytoscape';
import type { DagreLayoutOptions } from 'cytoscape-dagre';
import cDagre from 'cytoscape-dagre';

Cytoscape.use(cDagre);

type LayoutOptions = DagreLayoutOptions & Record<string, unknown>;

export const dagre: LayoutOptions = {
  name: 'dagre',
  // dagre algo options, uses default value on undefined
  nodeSep: 50, // the separation between adjacent nodes in the same rank
  edgeSep: 100, // the separation between adjacent edges in the same rank
  rankSep: 200, // the separation between each rank in the layout
  rankDir: 'LR', // 'TB' for top to bottom flow, 'LR' for left to right,
  align: undefined, // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
  acyclicer: undefined, // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
  // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
  ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
  minLen: function() {
    return 1;
  }, // number of ranks to keep between the source and target of the edge
  edgeWeight: function() {
    return 1;
  }, // higher weight edges are generally made shorter and straighter than lower weight edges

  // general layout options
  fit: true, // whether to fit to viewport
  padding: 20, // fit padding
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
  animate: false, // whether to transition the node positions
  animateFilter: function() {
    return true;
  }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  boundingBox: undefined,
  transform: function(node, pos) {
    return pos;
  }, // a function that applies a transform to the final node position
  ready: function() {}, // on layoutready
  sort: undefined, // a sorting function to order the nodes and edges; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  // because cytoscape dagre creates a directed graph, and directed graphs use the node order as a tie breaker when
  // defining the topology of a graph, this sort function can help ensure the correct order of the nodes/edges.
  // this feature is most useful when adding and removing the same nodes and edges multiple times in a graph.
  stop: function() {}, // on layoutstop
};
