import type { CSSProperties } from 'react';

export const style: CSSProperties = {
  width: '100%',
  height: 'calc(100vh - 250px)',
  outline: '1px dashed lightpink',
};

export const stylesheet: Array<cytoscape.Stylesheet> = [
  {
    selector: 'node[label]',
    style: {
      label: 'data(label)',
      'text-wrap': 'wrap',
      'text-max-width': '130px',
      'text-overflow-wrap': 'anywhere',
    },
  },

  {
    selector: 'edge[label]',
    style: {
      width: 2,
      label: 'data(label)',
      'target-arrow-shape': 'vee',
      'text-wrap': 'wrap',
      'text-max-width': '100px',
      'text-overflow-wrap': 'whitespace',
    },
  },

  {
    selector: '.address',
    style: {
      shape: 'round-rectangle',
      'text-valign': 'center',
      'text-halign': 'center',
      width: '150px',
      height: '50px',
      'background-color': 'papayawhip',
      'border-color': 'navy',
      'border-width': '3px',
    },
  },

  {
    selector: '.contract',
    style: {
      shape: 'cut-rectangle',
      'background-color': 'lightcyan',
      'border-color': 'darkturquoise',
    },
  },

  {
    selector: '.edge-label',
    style: {
      'text-background-opacity': 0.9,
      color: '#000',
      'text-background-color': '#FFF',
      'text-background-shape': 'roundrectangle',
      'text-border-color': 'lightgray',
      'text-border-width': 1,
      'text-border-opacity': 1,
      'text-border-style': 'dotted',
      'text-background-padding': '4px',
    },
  },
  {
    selector: '.curve-unbundled-bezier',
    style: {
      'curve-style': 'unbundled-bezier',
      'control-point-distances': '10 50 10',
      'control-point-weights': '0.1 0.5 0.9',
    },
  },
  {
    selector: '.curve-segments',
    style: {
      'curve-style': 'segments',
      'segment-distances': '-20 20 -20',
      'segment-weights': '0.1 0.5 0.9',
    },
  },
  {
    selector: '.curve-straight',
    style: {
      'curve-style': 'straight',
    },
  },
  {
    selector: '.curve-multi-unbundled-bezier',
    style: {
      'curve-style': 'unbundled-bezier',
      'control-point-distances': [ 40, -40 ],
      'control-point-weights': [ 0.250, 0.75 ],
    },
  },

  {
    selector: '.edge-in',
    style: {
      color: 'firebrick',
      'line-color': 'firebrick',
      'source-arrow-color': 'firebrick',
      'target-arrow-color': 'firebrick',
    },
  },
  {
    selector: '.edge-out',
    style: {
      color: 'steelblue',
      'line-color': 'steelblue',
      'source-arrow-color': 'steelblue',
      'target-arrow-color': 'steelblue',
    },
  },
];
