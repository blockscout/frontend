import React from 'react';

export interface LineChartOverlayProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

export const LineChartOverlay = React.forwardRef(({ width, height, children }: LineChartOverlayProps, ref: React.ForwardedRef<SVGRectElement>) => {
  return (
    <g className="ChartOverlay">
      { children }
      <rect ref={ ref } width={ width } height={ height } opacity={ 0 }/>
    </g>
  );
});
