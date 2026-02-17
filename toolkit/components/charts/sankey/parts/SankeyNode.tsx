import React from 'react';

import type { SankeyNodeExtended } from '../types';

export interface SankeyNodeProps {
  node: SankeyNodeExtended;
  color: string;
  onMouseEnter?: (node: SankeyNodeExtended, event: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

export const SankeyNode = React.memo(({ node, color, onMouseEnter, onMouseLeave }: SankeyNodeProps) => {
  const { x0 = 0, x1 = 0, y0 = 0, y1 = 0 } = node;
  const width = x1 - x0;
  const height = y1 - y0;

  const handleMouseEnter = React.useCallback((event: React.MouseEvent) => {
    onMouseEnter?.(node, event);
  }, [ node, onMouseEnter ]);

  if (width <= 0 || height <= 0) {
    return null;
  }

  return (
    <rect
      x={ x0 }
      y={ y0 }
      width={ width }
      height={ height }
      fill={ color }
      rx={ 4 }
      ry={ 4 }
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ onMouseLeave }
    >
      <title>{ `${ node.name }: ${ node.value }` }</title>
    </rect>
  );
});
