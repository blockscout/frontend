// SPDX-License-Identifier: LicenseRef-Blockscout

import { omit } from 'es-toolkit';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import multichainConfig from 'src/features/multichain/chains-config';
import getChainValueFromQuery from 'src/features/multichain/utils/get-chain-value-from-query';

import { scrollListToTop } from 'src/shared/pagination/usePaginationActions';
import { getPageFromQuery, PAGE_FIELDS } from 'src/shared/pagination/usePaginationParams';

export interface ChainValueParams {
  readonly chainIds?: Array<string>;
  readonly withAllOption?: boolean;
  readonly scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export interface ChainValue {
  readonly chainValue: Array<string>;
  readonly chain: ClusterChainConfig | undefined;
  readonly onChainValueChange: ({ value }: { value: Array<string> }) => void;
}

interface LatestInputs {
  readonly router: NextRouter;
  readonly scrollRef: React.RefObject<HTMLDivElement | null> | undefined;
}

const NO_CHAIN_VALUE: Array<string> = [];

export function useChainValue({ chainIds, withAllOption, scrollRef }: ChainValueParams = {}): ChainValue {
  const router = useRouter();
  const chainId = getChainValueFromQuery(router.query, chainIds, withAllOption);

  const chainValue = React.useMemo(() => (chainId ? [ chainId ] : NO_CHAIN_VALUE), [ chainId ]);
  const chain = React.useMemo(() => multichainConfig()?.chains.find((item) => item.id === chainId), [ chainId ]);

  const latest = React.useRef<LatestInputs>({ router, scrollRef });
  latest.current = { router, scrollRef };

  const onChainValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    const { router: { pathname, query, push }, scrollRef } = latest.current;
    if (getPageFromQuery(query) !== 1) {
      scrollListToTop(scrollRef, false);
    }
    push({ pathname, query: { ...omit(query, PAGE_FIELDS), chain_id: value[0] } }, undefined, { shallow: true });
  }, []);

  return React.useMemo(() => ({ chainValue, chain, onChainValueChange }), [ chainValue, chain, onChainValueChange ]);
}
