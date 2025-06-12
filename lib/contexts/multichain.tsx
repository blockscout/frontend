import { useRouter } from 'next/router';
import React from 'react';

import type { SubchainConfig } from 'types/multichain';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';

interface MultichainProviderProps {
  children: React.ReactNode;
  subchainSlug?: string;
}

export interface TMultichainContext {
  subchain: SubchainConfig;
}

export const MultichainContext = React.createContext<TMultichainContext | null>(null);

export function MultichainProvider({ children, subchainSlug: subchainSlugProp }: MultichainProviderProps) {
  const router = useRouter();
  const subchainSlugQueryParam = router.pathname.includes('subchain-slug') ? getQueryParamString(router.query['subchain-slug']) : undefined;

  const [ subchainSlug, setSubchainSlug ] = React.useState<string | undefined>(subchainSlugProp ?? subchainSlugQueryParam);

  React.useEffect(() => {
    if (subchainSlugProp) {
      setSubchainSlug(subchainSlugProp);
    }
  }, [ subchainSlugProp ]);

  const subchain = React.useMemo(() => {
    const config = multichainConfig();
    if (!config) {
      return;
    }

    if (!subchainSlug) {
      return;
    }

    return config.chains.find((chain) => chain.slug === subchainSlug);
  }, [ subchainSlug ]);

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
