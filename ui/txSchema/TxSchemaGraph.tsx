import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

import * as layouts from './layouts/index';
import * as theme from './theme';

interface Props {
  elements: Parameters<typeof CytoscapeComponent['normalizeElements']>[0];
}

const TxSchemaGraph = (props: Props) => {
  const cy = React.useRef<cytoscape.Core>();

  React.useEffect(() => {
    if (!cy.current) {
      return;
    }

    cy.current.layout(layouts.dagre).run();

    cy.current.on('tap', 'node', function(event) {
      const url = event.target.data('href');
      if (url) {
        try {
          window.open(url);
        } catch (e) {
          window.location.href = url;
        }
      }
    });

    cy.current.on('tap', 'edge', function(event) {
      const url = event.target.data('href');
      if (url) {
        try {
          window.open(url);
        } catch (e) {
          window.location.href = url;
        }
      }
    });
  }, []);

  const setRef = React.useCallback((node: cytoscape.Core) => {
    cy.current = node;
  }, []);

  const elements = CytoscapeComponent.normalizeElements(props.elements);

  return (
    <CytoscapeComponent
      cy={ setRef }
      elements={ elements }
      style={ theme.style }
      stylesheet={ theme.stylesheet }
      // zoomingEnabled={ false }
      userZoomingEnabled={ false }
      boxSelectionEnabled={ false }
    />
  );
};

export default TxSchemaGraph;
