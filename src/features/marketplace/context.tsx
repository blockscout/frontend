// SPDX-License-Identifier: LicenseRef-Blockscout

import React, { createContext, useContext, useState, useMemo } from 'react';

type Props = {
  children: React.ReactNode;
};

type TMarketplaceContext = {
  isAutoConnectDisabled: boolean;
  setIsAutoConnectDisabled: (isAutoConnectDisabled: boolean) => void;
};

export const MarketplaceContext = createContext<TMarketplaceContext>({
  isAutoConnectDisabled: false,
  setIsAutoConnectDisabled: () => {},
});

export function MarketplaceContextProvider({ children }: Props) {
  const [ isAutoConnectDisabled, setIsAutoConnectDisabled ] = useState(false);

  const value = useMemo(() => ({
    isAutoConnectDisabled,
    setIsAutoConnectDisabled,
  }), [ isAutoConnectDisabled, setIsAutoConnectDisabled ]);

  return (
    <MarketplaceContext.Provider value={ value }>
      { children }
    </MarketplaceContext.Provider>
  );
}

export function useMarketplaceContext() {
  return useContext(MarketplaceContext);
}
