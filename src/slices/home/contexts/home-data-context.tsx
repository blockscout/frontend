// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useHomeBlocksData, { type HomeBlocksData, type HomeBlocksQueryResult } from 'src/slices/home/hooks/useHomeBlocksData';

import useHomeLatestBatchData, { type HomeLatestBatchQueryResult } from 'src/features/rollup/common/hooks/useHomeLatestBatchData';

type HomeDataContextValue = {
  blocksQuery: HomeBlocksQueryResult | undefined;
  blocksSocket: Pick<HomeBlocksData, 'newBlocksCount' | 'showSocketErrorAlert'> | undefined;
  latestBatchQuery: HomeLatestBatchQueryResult | undefined;
};

const HomeDataContext = React.createContext<HomeDataContextValue | null>(null);

export function HomeDataContextProvider({ children }: { children: React.ReactNode }) {
  const blocksData = useHomeBlocksData();
  const latestBatchQuery = useHomeLatestBatchData();

  const value = React.useMemo<HomeDataContextValue>(() => ({
    blocksQuery: blocksData?.query,
    blocksSocket: blocksData,
    latestBatchQuery,
  }), [ blocksData, latestBatchQuery ]);

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
