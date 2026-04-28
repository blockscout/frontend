import React from 'react';

import useHomeBlocksData, { type HomeBlocksQueryResult } from './useHomeBlocksData';
import useHomeLatestBatchData, { type HomeLatestBatchQueryResult } from './useHomeLatestBatchData';

type HomeDataContextValue = {
  blocksQuery: HomeBlocksQueryResult;
  latestBatchQuery: HomeLatestBatchQueryResult | undefined;
};

const HomeDataContext = React.createContext<HomeDataContextValue | null>(null);

export function HomeDataContextProvider({ children }: { children: React.ReactNode }) {
  const blocksQuery = useHomeBlocksData();
  const latestBatchQuery = useHomeLatestBatchData();

  const value = React.useMemo<HomeDataContextValue>(() => ({
    blocksQuery,
    latestBatchQuery,
  }), [ blocksQuery, latestBatchQuery ]);

  return (
    <HomeDataContext.Provider value={ value }>
      { children }
    </HomeDataContext.Provider>
  );
}

export function useHomeDataContext(): HomeDataContextValue {
  const ctx = React.useContext(HomeDataContext);
  if (!ctx) {
    throw new Error('useHomeDataContext must be used within HomeDataContextProvider');
  }
  return ctx;
}
