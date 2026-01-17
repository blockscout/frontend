import { Box, Flex } from '@chakra-ui/react';
import { useQueries, useQuery } from '@tanstack/react-query';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { publicClient } from 'lib/web3/client';
import formatTxData from 'lib/web3/rpc/formatTxData';
import { TX } from 'stubs/tx';
import { Link } from 'toolkit/chakra/link';
import { SECOND } from 'toolkit/utils/consts';

import LatestTxsItem from '../LatestTxsItem';
import LatestTxsItemMobile from '../LatestTxsItemMobile';
import LatestTxsDegradedNewItems from './LatestTxsDegradedNewItems';
import LatestTxsFallback from './LatestTxsFallback';

const zetachainFeature = config.features.zetachain;

const LIMIT = 5;

interface Props {
  maxNum: number;
}

const LatestTxsDegraded = ({ maxNum }: Props) => {
  const [ txs, setTxs ] = React.useState<Array<Transaction>>([]);
  const [ isError, setIsError ] = React.useState(false);
  const [ isLoading, setIsLoading ] = React.useState(true);
  const [ overflow, setOverflow ] = React.useState(0);

  const mainQuery = useQuery({
    queryKey: [ 'RPC', 'watch-blocks-with-txs' ],
    queryFn: async() => {
      if (!publicClient) {
        return null;
      }
      setTxs([]);
      setOverflow(0);
      setIsError(false);
      setIsLoading(true);

      return publicClient.watchBlocks({
        onBlock: (block) => {
          setTxs((prevTxs) => {
            try {
              const newTxs = block.transactions.map((tx) => formatTxData(tx, null, null, block)).filter(Boolean);
              const nextTxs = prevTxs.length < LIMIT ? [ ...prevTxs, ...newTxs ].slice(0, LIMIT) : prevTxs;

              const totalTxs = overflow + prevTxs.length + newTxs.length;
              setOverflow(totalTxs > maxNum ? totalTxs - maxNum : 0);

              return nextTxs;
            } catch (_) {
              setIsError(true);
              return prevTxs;
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
    enabled: Boolean(publicClient),
  });

  const receiptQueries = useQueries({
    queries: txs.map((tx) => ({
      queryKey: [ 'RPC', 'tx-receipt', { hash: tx.hash } ],
      queryFn: async() => {
        if (!publicClient) {
          return null;
        }
        return publicClient.getTransactionReceipt({ hash: tx.hash as `0x${ string }` });
      },
      enabled: txs.length > 0 && !mainQuery.isError && !isError && Boolean(publicClient),
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

  const unwatch = mainQuery.data;

  React.useEffect(() => {
    return () => {
      unwatch?.();
    };
  }, [ unwatch ]);

  if (mainQuery.isError || isError || !publicClient) {
    return <LatestTxsFallback/>;
  }

  const items = isLoading ? Array(maxNum).fill(TX) : txs.slice(0, maxNum);

  if (items.length === 0) {
    return <Box textStyle="sm">No latest transactions found.</Box>;
  }

  const txsUrl = route({ pathname: `/txs`, query: zetachainFeature.isEnabled ? { tab: 'evm' } : undefined });

  return (
    <>
      <LatestTxsDegradedNewItems overflow={ overflow } url={ txsUrl } isLoading={ isLoading }/>
      <Box mb={ 3 } display={{ base: 'block', lg: 'none' }} textStyle="sm">
        { items.map(((tx, index) => (
          <LatestTxsItemMobile
            key={ tx.hash + (isLoading ? index : '') }
            tx={ tx }
            isLoading={ isLoading }
          />
        ))) }
      </Box>
      <AddressHighlightProvider>
        <Box mb={ 3 } display={{ base: 'none', lg: 'block' }} textStyle="sm">
          { items.map(((tx, index) => (
            <LatestTxsItem
              key={ tx.hash + (isLoading ? index : '') }
              tx={ tx }
              isLoading={ isLoading }
            />
          ))) }
        </Box>
      </AddressHighlightProvider>
      <Flex justifyContent="center">
        <Link textStyle="sm" loading={ isLoading } href={ txsUrl }>View all transactions</Link>
      </Flex>
    </>
  );
};

export default React.memo(LatestTxsDegraded);
