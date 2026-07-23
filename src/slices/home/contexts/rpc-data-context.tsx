// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueries, useQuery } from '@tanstack/react-query';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { formatBlockListData } from 'src/slices/block/utils/format-rpc-data';
import { formatTxListRpcData } from 'src/slices/tx/utils/format-rpc-data';

import { getPublicClient, isPublicClientAvailable } from 'src/features/connect-wallet/utils/public-client';

import { SECOND } from 'src/toolkit/utils/consts';

export type SubscriptionId = 'latest-blocks' | 'latest-txs' | 'stats-widgets';

interface HomeRpcDataContext {
  blocks: Array<schemas['Block']>;
  txs: Array<schemas['Transaction']>;
  totalTxs: number;
  isError: boolean;
  isLoading: boolean;
  isEnabled: boolean;
  enable: (isEnabled: boolean, id: SubscriptionId) => void;
  subscriptions: Array<SubscriptionId>;
}

export const HomeRpcDataContext = React.createContext<HomeRpcDataContext | null>(null);

const ITEMS_LIMIT = 5;

export function HomeRpcDataContextProvider({ children }: { children: React.ReactNode }) {
  const [ blocks, setBlocks ] = React.useState<Array<schemas['Block']>>([]);
  const [ txs, setTxs ] = React.useState<Array<schemas['Transaction']>>([]);
  const [ totalTxs, setTotalTxs ] = React.useState(0);
  const [ isLoading, setIsLoading ] = React.useState(true);
  const [ isError, setIsError ] = React.useState(false);
  const [ isEnabled, setIsEnabled ] = React.useState(false);
  const [ subscriptions, setSubscriptions ] = React.useState<Array<SubscriptionId>>([]);

  const query = useQuery({
    queryKey: [ 'RPC', 'watch-blocks' ],
    queryFn: async() => {
      const publicClient = await getPublicClient();
      if (!publicClient) {
        return null;
      }

      return publicClient.watchBlocks({
        onBlock: (block) => {
          setTxs((prevTxs) => {
            try {
              const newTxs = block.transactions.map((tx) => formatTxListRpcData({ tx, receipt: null, confirmations: null, block })).filter(Boolean);
              const nextTxs = prevTxs.length < ITEMS_LIMIT ? [ ...prevTxs, ...newTxs ].slice(0, ITEMS_LIMIT) : prevTxs;

              const totalTxs = prevTxs.length + newTxs.length;
              setTotalTxs(totalTxs);

              return nextTxs;
            } catch (_) {
              setIsError(true);
              return prevTxs;
            }
          });
          setBlocks((prev) => {
            try {
              return [
                formatBlockListData({
                  ...block,
                  transactions: block.transactions.map((tx) => tx.hash),
                }),
                ...prev,
              ].filter(Boolean).slice(0, ITEMS_LIMIT);
            } catch (_) {
              setIsError(true);
              return prev;
            }
          });
        },
        onError: () => {
          setIsError(true);
          setIsLoading(false);
        },
        pollingInterval: 5 * SECOND,
        includeTransactions: true,
      });
    },
    enabled: isPublicClientAvailable && isEnabled,
  });

  const receiptQueries = useQueries({
    queries: txs.map((tx) => ({
      queryKey: [ 'RPC', 'tx-receipt', { hash: tx.hash } ],
      queryFn: async() => {
        const publicClient = await getPublicClient();
        if (!publicClient) {
          return null;
        }
        return publicClient.getTransactionReceipt({ hash: tx.hash as `0x${ string }` });
      },
      enabled: txs.length > 0 && !isError && isPublicClientAvailable,
      staleTime: Infinity,
    })),
  });

  const areReceiptsLoading = txs.length === 0 || receiptQueries.some((query) => query.isPending);

  React.useEffect(() => {
    if (!areReceiptsLoading) {
      setTxs((prev) => {
        return prev.map((tx) => {
          const receipt = receiptQueries.find((query) => query.data?.transactionHash === tx.hash);
          if (!receipt) {
            return tx;
          }
          return {
            ...tx,
            status: receipt?.status === 'success' ? 'ok' : 'error',
          };
        });
      });
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ areReceiptsLoading ]);

  const unwatch = query.data;
  const isQueryError = query.isError;

  React.useEffect(() => {
    return () => {
      unwatch?.();
    };
  }, [ unwatch ]);

  const enable = React.useCallback((isEnabled: boolean, id: SubscriptionId) => {
    if (!isPublicClientAvailable) {
      setIsError(true);
      setIsLoading(false);
      setIsEnabled(false);
      return;
    }

    setIsEnabled(isEnabled);
    if (isEnabled) {
      setIsLoading(true);
      setSubscriptions((prev) => [ ...prev, id ]);
    } else {
      setIsLoading(false);
      setSubscriptions((prev) => {
        const next = prev.filter((subscription) => subscription !== id);
        if (next.length === 0) {
          unwatch?.();
        }
        return next;
      });
    }
  }, [ unwatch ]);

  const value = React.useMemo(() => ({
    blocks,
    txs,
    totalTxs,
    isError: isQueryError || isError,
    isLoading,
    isEnabled,
    enable,
    subscriptions,
  }), [ blocks, txs, totalTxs, isQueryError, isError, isLoading, isEnabled, enable, subscriptions ]);

  return (
    <HomeRpcDataContext.Provider value={ value }>
      { children }
    </HomeRpcDataContext.Provider>
  );
}

export function useHomeRpcDataContext() {
  const context = React.useContext(HomeRpcDataContext);
  if (!context) {
    throw new Error('useHomeRpcDataContext must be used within a HomeRpcDataContextProvider');
  }
  return context;
}
