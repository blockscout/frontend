import React from 'react';

// TODO @tom2drum remove this hook
export default function useIsAccountActionAllowed() {
  return React.useCallback(() => {
    return true;
  }, []);
}
