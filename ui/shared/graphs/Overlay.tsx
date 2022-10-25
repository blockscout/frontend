import React from 'react';

interface Props {
  width: number;
  height: number;
  children: React.ReactNode;
}

const Overlay = ({ width, height, children }: Props, ref: React.LegacyRef<SVGRectElement>) => {
  return (
    <g className="TooltipOverlay">
      { children }
      <rect ref={ ref } width={ width } height={ height } opacity={ 0 }/>
    </g>
  );
};

export default React.forwardRef(Overlay);
