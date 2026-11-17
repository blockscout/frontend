// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueries } from '@tanstack/react-query';
import React from 'react';
import type { OnBlockParameter, Chain } from 'viem';

import type { schemas } from '@blockscout/api-types';

import { formatBlockListData } from 'src/slices/block/utils/format-rpc-data';
import { formatTxListRpcData } from 'src/slices/tx/utils/format-rpc-data';

import { getPublicClient, isPublicClientAvailable } from 'src/features/connect-wallet/utils/public-client';

import { SECOND } from 'src/toolkit/utils/consts';

export type SubscriptionId = 'latest-blocks' | 'latest-txs' | 'stats-widgets' |
'stats-widgets-latest-block' | 'stats-widgets-average-block-time';

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
  const [ isLoaded, setIsLoaded ] = React.useState(false);
  const [ isError, setIsError ] = React.useState(false);
  const [ subscriptions, setSubscriptions ] = React.useState<Array<SubscriptionId>>([]);

  const isEnabled = isPublicClientAvailable && subscriptions.length > 0;

  const handleBlock = React.useCallback((block: OnBlockParameter<Chain | undefined, true, 'latest'>) => {
    let newTxs: Array<schemas['Transaction']>;
    let newBlock: ReturnType<typeof formatBlockListData>;

    try {
      newTxs = block.transactions.map((tx) => formatTxListRpcData({ tx, receipt: null, confirmations: null, block })).filter(Boolean);
      newBlock = formatBlockListData({
        ...block,
        transactions: block.transactions.map((tx) => tx.hash),
      });
    } catch (_) {
      setIsError(true);
      return;
    }

    setTxs((prev) => prev.length < ITEMS_LIMIT ? [ ...prev, ...newTxs ].slice(0, ITEMS_LIMIT) : prev);
    setTotalTxs((prev) => prev + newTxs.length);
    setBlocks((prev) => [ newBlock, ...prev ].filter(Boolean).slice(0, ITEMS_LIMIT));
  }, []);

  React.useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isCancelled = false;
    let unwatch: (() => void) | undefined;

    const handleError = () => setIsError(true);

    getPublicClient()
      .then((publicClient) => {
        if (isCancelled) {
          return;
        }

        if (!publicClient) {
          handleError();
          return;
        }

        unwatch = publicClient.watchBlocks({
          onBlock: handleBlock,
          onError: handleError,
          pollingInterval: 5 * SECOND,
          includeTransactions: true,
          emitOnBegin: true,
        });
      })
      .catch(handleError);

    return () => {
      isCancelled = true;
      unwatch?.();
    };
  }, [ isEnabled, handleBlock ]);

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

  const hasBlocks = blocks.length > 0;
  const areReceiptsLoading = receiptQueries.some((query) => query.isPending);

  React.useEffect(() => {
    if (hasBlocks && !areReceiptsLoading) {
      setTxs((prev) => {
        return prev.map((tx) => {
          const receipt = receiptQueries.find((query) => query.data?.transactionHash === tx.hash);
          if (!receipt) {
            return tx;
          }
          return {
            ...tx,
            status: receipt.data?.status === 'success' ? 'ok' : 'error',
          };
        });
      });
      setIsLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- receiptQueries is a new array on every render; areReceiptsLoading tracks its settled state
  }, [ areReceiptsLoading, hasBlocks ]);

  const enable = React.useCallback((isEnabled: boolean, id: SubscriptionId) => {
    if (!isPublicClientAvailable) {
      setIsError(true);
      return;
    }

    setSubscriptions((prev) => {
      const next = prev.filter((subscription) => subscription !== id);
      return isEnabled ? [ ...next, id ] : next;
    });
  }, []);

  const isLoading = !isError && !isLoaded;

  const value = React.useMemo(() => ({
    blocks,
    txs,
    totalTxs,
    isError,
    isLoading,
    isEnabled,
    enable,
    subscriptions,
  }), [ blocks, txs, totalTxs, isError, isLoading, isEnabled, enable, subscriptions ]);

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
