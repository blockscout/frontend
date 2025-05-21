import { useRouter } from 'next/router';
import React from 'react';

import type { SubchainConfig } from 'types/multichain';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';

interface MultichainProviderProps {
  children: React.ReactNode;
}

interface TMultichainContext {
  subchain: SubchainConfig;
}

export const MultichainContext = React.createContext<TMultichainContext | null>(null);

export function MultichainProvider({ children }: MultichainProviderProps) {
  const router = useRouter();

  const subchainId = getQueryParamString(router.query['subchain-id']);

  const subchain = React.useMemo(() => {
    if (!subchainId) {
      return multichainConfig.chains[0];
    }

    return multichainConfig.chains.find((chain) => chain.id === subchainId);
  }, [ subchainId ]);

  const value = React.useMemo(() => {
    if (!subchain) {
      return null;
    }

    return {
      subchain,
    };
  }, [ subchain ]);

  return (
    <MultichainContext.Provider value={ value }>
      { children }
    </MultichainContext.Provider>
  );
}

export function useMultichainContext(disabled?: boolean) {
  const context = React.useContext(MultichainContext);
  if (context === undefined || disabled) {
    return null;
  }
  return context;
}
