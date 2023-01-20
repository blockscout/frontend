import _debounce from 'lodash/debounce';
import React, { useCallback } from 'react';

import type { ChartMargin, ChartOffset } from 'ui/shared/chart/types';

export default function useChartSize(svgEl: SVGSVGElement | null, margin?: ChartMargin, offsets?: ChartOffset) {
  const [ rect, setRect ] = React.useState<{ width: number; height: number}>({ width: 0, height: 0 });

  const calculateRect = useCallback((element: SVGSVGElement) => {
    const rect = element?.getBoundingClientRect();
    return { width: rect?.width || 0, height: rect?.height || 0 };
  }, []);

  React.useEffect(() => {
    const content = window.document.querySelector('main');
    if (!content) {
      return;
    }

    let timeoutId: number;
    const resizeHandler = _debounce(() => {
      timeoutId = window.setTimeout(() => {
        if (svgEl) {
          setRect(calculateRect(svgEl));
        }
      }, 100);
    }, 100);

    const resizeObserver = new ResizeObserver(resizeHandler);
    resizeObserver.observe(content);
    resizeObserver.observe(window.document.body);

    return function cleanup() {
      resizeObserver.unobserve(content);
      resizeObserver.unobserve(window.document.body);
      window.clearTimeout(timeoutId);
    };
  }, [ calculateRect, svgEl ]);

  return React.useMemo(() => {
    return {
      width: Math.max(rect.width - (offsets?.x || 0), 0),
      height: Math.max(rect.height - (offsets?.y || 0), 0),
      innerWidth: Math.max(rect.width - (offsets?.x || 0) - (margin?.left || 0) - (margin?.right || 0), 0),
      innerHeight: Math.max(rect.height - (offsets?.y || 0) - (margin?.bottom || 0) - (margin?.top || 0), 0),
    };
  }, [ margin?.bottom, margin?.left, margin?.right, margin?.top, offsets?.x, offsets?.y, rect.height, rect.width ]);
}
