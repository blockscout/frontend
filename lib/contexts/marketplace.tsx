import { useRouter } from 'next/router';
import React, { createContext, useContext } from 'react';

type Props = {
  children: React.ReactNode;
}

type TMarketplaceContext = {
  isAutoConnectDisabled: boolean;
  setIsAutoConnectDisabled: (isAutoConnectDisabled: boolean) => void;
}

const MarketplaceContext = createContext<TMarketplaceContext>({
  isAutoConnectDisabled: false,
  setIsAutoConnectDisabled: () => {},
});

export function MarketplaceContextProvider({ children }: Props) {
  const router = useRouter();
  const [ isAutoConnectDisabled, setIsAutoConnectDisabled ] = React.useState(false);

  React.useEffect(() => {
    setIsAutoConnectDisabled(false);
  }, [ router.pathname ]);

  return (
    <MarketplaceContext.Provider value={{ isAutoConnectDisabled, setIsAutoConnectDisabled }}>
      { children }
    </MarketplaceContext.Provider>
  );
}

export function useMarketplaceContext() {
  return useContext(MarketplaceContext);
}
