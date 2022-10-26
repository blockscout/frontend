import React from 'react';

interface Props {
  width: number;
  height: number;
  children: React.ReactNode;
}

const ChartOverlay = ({ width, height, children }: Props, ref: React.ForwardedRef<SVGRectElement>) => {
  return (
    <g className="ChartOverlay">
      { children }
      <rect ref={ ref } width={ width } height={ height } opacity={ 0 }/>
    </g>
  );
};

export default React.forwardRef(ChartOverlay);
