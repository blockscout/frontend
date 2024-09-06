import React from 'react';

export default function useZoomReset() {
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);

  const handleZoom = React.useCallback(() => {
    setIsZoomResetInitial(false);
  }, []);

  const handleZoomReset = React.useCallback(() => {
    setIsZoomResetInitial(true);
  }, []);

  return {
    isZoomResetInitial,
    handleZoom,
    handleZoomReset,
  };
}
