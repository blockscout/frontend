import { useRouter } from 'next/router';
import React from 'react';

import type { SubchainConfig } from 'types/multichain';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';

interface MultichainProviderProps {
  children: React.ReactNode;
  subchainId?: string;
}

export interface TMultichainContext {
  subchain: SubchainConfig;
}

export const MultichainContext = React.createContext<TMultichainContext | null>(null);

export function MultichainProvider({ children, subchainId: subchainIdProp }: MultichainProviderProps) {
  const router = useRouter();
  const subchainIdQueryParam = router.pathname.includes('subchain-id') ? getQueryParamString(router.query['subchain-id']) : undefined;

  const [ subchainId, setSubchainId ] = React.useState<string | undefined>(subchainIdProp ?? subchainIdQueryParam);

  React.useEffect(() => {
    if (subchainIdProp) {
      setSubchainId(subchainIdProp);
    }
  }, [ subchainIdProp ]);

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

export function useMultichainContext(disabled: boolean = !multichainConfig) {
  const context = React.useContext(MultichainContext);
  if (context === undefined || disabled) {
    return null;
  }
  return context;
}
