import { useRouter } from 'next/router';
import React from 'react';

import type { ChainConfig } from 'types/multichain';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';

interface MultichainProviderProps {
  children: React.ReactNode;
  chainSlug?: string;
}

export interface TMultichainContext {
  chain: ChainConfig;
}

export const MultichainContext = React.createContext<TMultichainContext | null>(null);

export function MultichainProvider({ children, chainSlug: chainSlugProp }: MultichainProviderProps) {
  const router = useRouter();
  const chainSlugQueryParam = router.pathname.includes('chain-slug') ? getQueryParamString(router.query['chain-slug']) : undefined;

  const [ chainSlug, setChainSlug ] = React.useState<string | undefined>(chainSlugProp ?? chainSlugQueryParam);

  React.useEffect(() => {
    if (chainSlugProp) {
      setChainSlug(chainSlugProp);
    }
  }, [ chainSlugProp ]);

  const chain = React.useMemo(() => {
    const config = multichainConfig();
    if (!config) {
      return;
    }

    if (!chainSlug) {
      return;
    }

    return config.chains.find((chain) => chain.slug === chainSlug);
  }, [ chainSlug ]);

  const value = React.useMemo(() => {
    if (!chain) {
      return null;
    }

    return {
      chain,
    };
  }, [ chain ]);

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
