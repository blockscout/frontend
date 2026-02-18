import * as d3 from 'd3';
import React from 'react';

import type { SankeyLinkExtended, SankeyNodeDatum } from '../types';

export interface SankeyLinkProps {
  link: SankeyLinkExtended;

  /** Single color when gradient is not used */
  color?: string;

  /** When set with targetColor, link stroke is a gradient from source to target */
  sourceColor?: string;
  targetColor?: string;

  /** Unique suffix for gradient id (e.g. link index) when multiple links share same source/target */
  gradientIdSuffix?: string | number;
  opacity: number;
  hoverOpacity: number;

  pathGenerator: (link: SankeyLinkExtended, ...args: Array<any>) => string | null;
  onMouseEnter?: (link: SankeyLinkExtended, event: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

export const SankeyLink = React.memo(({
  link,
  color,
  sourceColor,
  targetColor,
  gradientIdSuffix,
  opacity,
  hoverOpacity,
  pathGenerator,
  onMouseEnter,
  onMouseLeave,
}: SankeyLinkProps) => {
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

  const useGradient = sourceColor != null && targetColor != null && sourceColor !== targetColor;
  const gradientId = useGradient ?
    `sankey-link-${ source.id }-${ target.id }-${ gradientIdSuffix ?? '' }` :
    undefined;

  const strokeColor = useGradient && gradientId ?
    `url(#${ gradientId })` :
    color;

  const sourceBounds = source as SankeyNodeDatum & { x0?: number; x1?: number; y0?: number; y1?: number };
  const targetBounds = target as SankeyNodeDatum & { x0?: number; x1?: number; y0?: number; y1?: number };
  const sourceX = sourceBounds.x1 ?? 0;
  const sourceY = ((sourceBounds.y0 ?? 0) + (sourceBounds.y1 ?? 0)) / 2;
  const targetX = targetBounds.x0 ?? 0;
  const targetY = ((targetBounds.y0 ?? 0) + (targetBounds.y1 ?? 0)) / 2;

  return (
    <>
      { useGradient && gradientId && (
        <defs>
          <linearGradient
            id={ gradientId }
            gradientUnits="userSpaceOnUse"
            x1={ sourceX }
            y1={ sourceY }
            x2={ targetX }
            y2={ targetY }
          >
            <stop offset="0%" stopColor={ sourceColor }/>
            <stop offset="100%" stopColor={ targetColor }/>
          </linearGradient>
        </defs>
      ) }
      <path
        ref={ ref }
        d={ d }
        fill="none"
        stroke={ strokeColor }
        strokeOpacity={ opacity }
        strokeWidth={ Math.max(1, link.width || 0) }
        onMouseEnter={ handleMouseEnter }
        onMouseLeave={ handleMouseLeave }
      >
        <title>{ `${ source.name } → ${ target.name }: ${ link.value }` }</title>
      </path>
    </>
  );
});
