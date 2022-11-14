import _debounce from 'lodash/debounce';
import React from 'react';

import type { ChartMargin, ChartOffset } from 'ui/shared/chart/types';

export default function useChartSize(svgEl: SVGSVGElement | null, margin?: ChartMargin, offsets?: ChartOffset) {
  const [ rect, setRect ] = React.useState<{ width: number; height: number}>({ width: 0, height: 0 });

  const calculateRect = React.useCallback(() => {
    const rect = svgEl?.getBoundingClientRect();
    return { width: rect?.width || 0, height: rect?.height || 0 };
  }, [ svgEl ]);

  React.useEffect(() => {
    setRect(calculateRect());
  }, [ calculateRect ]);

  React.useEffect(() => {
    let timeoutId: number;
    const resizeHandler = _debounce(() => {
      setRect({ width: 0, height: 0 });
      timeoutId = window.setTimeout(() => {
        setRect(calculateRect());
      }, 0);
    }, 100);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.unobserve(document.body);
      window.clearTimeout(timeoutId);
    };
  }, [ calculateRect ]);

  return React.useMemo(() => {
    return {
      width: Math.max(rect.width - (offsets?.x || 0), 0),
      height: Math.max(rect.height - (offsets?.y || 0), 0),
      innerWidth: Math.max(rect.width - (offsets?.x || 0) - (margin?.left || 0) - (margin?.right || 0), 0),
      innerHeight: Math.max(rect.height - (offsets?.y || 0) - (margin?.bottom || 0) - (margin?.top || 0), 0),
    };
  }, [ margin?.bottom, margin?.left, margin?.right, margin?.top, offsets?.x, offsets?.y, rect.height, rect.width ]);
}
