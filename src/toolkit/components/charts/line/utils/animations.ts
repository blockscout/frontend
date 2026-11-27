// SPDX-License-Identifier: LicenseRef-Blockscout

import * as d3 from 'd3';
// d3 declares no side effects, so a bundle drops the one that adds selection.transition()
import 'd3-transition';

export type AnimationType = 'left' | 'fadeIn' | 'none';

export const animateLeft = (path: SVGPathElement) => {
  const totalLength = path.getTotalLength() || 0;
  d3.select(path)
    .attr('opacity', 1)
    .attr('stroke-dasharray', `${ totalLength },${ totalLength }`)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(750)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);
};

export const animateFadeIn = (path: SVGPathElement) => {
  d3.select(path)
    .transition()
    .duration(750)
    .ease(d3.easeLinear)
    .attr('opacity', 1);
};

export const noneAnimation = (path: SVGPathElement) => {
  d3.select(path).attr('opacity', 1);
};

export const ANIMATIONS: Record<AnimationType, (path: SVGPathElement) => void> = {
  left: animateLeft,
  fadeIn: animateFadeIn,
  none: noneAnimation,
};
