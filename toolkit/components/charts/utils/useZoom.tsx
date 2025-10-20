import React from 'react';

export default function useZoom() {
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);
  const [ zoomRange, setZoomRange ] = React.useState<[ Date, Date ] | undefined>();

  const handleZoom = React.useCallback((range: [ Date, Date ]) => {
    setZoomRange(range);
    setIsZoomResetInitial(false);
  }, []);

  const handleZoomReset = React.useCallback(() => {
    setZoomRange(undefined);
    setIsZoomResetInitial(true);
  }, []);

  return {
    isZoomResetInitial,
    zoomRange,
    handleZoom,
    handleZoomReset,
  };
}
