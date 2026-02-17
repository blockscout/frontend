import * as d3 from 'd3';
import React from 'react';

import type { SankeyLinkExtended, SankeyNodeDatum } from '../types';

export interface SankeyLinkProps {
  link: SankeyLinkExtended;
  color: string;
  opacity: number;
  hoverOpacity: number;

  pathGenerator: (link: SankeyLinkExtended, ...args: Array<any>) => string | null;
  onMouseEnter?: (link: SankeyLinkExtended, event: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

export const SankeyLink = React.memo(({ link, color, opacity, hoverOpacity, pathGenerator, onMouseEnter, onMouseLeave }: SankeyLinkProps) => {
  const ref = React.useRef<SVGPathElement>(null);

  const handleMouseEnter = React.useCallback((event: React.MouseEvent) => {
    if (ref.current) {
      d3.select(ref.current).transition().duration(200).attr('stroke-opacity', hoverOpacity);
    }
    onMouseEnter?.(link, event);
  }, [ link, hoverOpacity, onMouseEnter ]);

  const handleMouseLeave = React.useCallback(() => {
    if (ref.current) {
      d3.select(ref.current).transition().duration(200).attr('stroke-opacity', opacity);
    }
    onMouseLeave?.();
  }, [ opacity, onMouseLeave ]);

  const source = link.source as SankeyNodeDatum;
  const target = link.target as SankeyNodeDatum;

  const d = pathGenerator(link);
  if (!d) {
    return null;
  }

  return (
    <path
      ref={ ref }
      d={ d }
      fill="none"
      stroke={ color }
      strokeOpacity={ opacity }
      strokeWidth={ Math.max(1, link.width || 0) }
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
    >
      <title>{ `${ source.name } → ${ target.name }: ${ link.value }` }</title>
    </path>
  );
});
