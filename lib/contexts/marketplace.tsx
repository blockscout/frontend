import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect } from 'react';

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

  useEffect(() => {
    const handleRouteChange = () => {
      setIsAutoConnectDisabled(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [ router.events ]);

  return (
    <MarketplaceContext.Provider value={{ isAutoConnectDisabled, setIsAutoConnectDisabled }}>
      { children }
    </MarketplaceContext.Provider>
  );
}

export function useMarketplaceContext() {
  return useContext(MarketplaceContext);
}
