// SPDX-License-Identifier: LicenseRef-Blockscout

import { Separator } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';

import { route } from 'src/server/routes';

import useApiQuery from 'src/api/hooks/useApiQuery';
import { SocketProvider } from 'src/api/socket/context';
import getSocketUrl from 'src/api/socket/get-socket-url';

import TxsContent from 'src/slices/tx/pages/index/list/TxsContent';
import { TX } from 'src/slices/tx/stubs/tx';

import { useMultichainContext } from 'src/features/multichain/context';

import { Link } from 'src/toolkit/chakra/link';

const PAGINATION_PARAMS: PaginationParams = {
  page: 1,
  isVisible: false,
  isLoading: false,
  hasPages: false,
  hasNextPage: false,
  canGoBackwards: false,
  onNextPageClick: () => {},
  onPrevPageClick: () => {},
  resetPage: () => {},
};

const LatestTxsLocal = () => {
  const chain = useMultichainContext()?.chain;

  const query = useApiQuery('core:homepage_txs', {
    chain,
    queryOptions: {
      placeholderData: Array(3).fill(TX),
      select: (data) => data.slice(0, 3),
    },
  });

  return (
    <SocketProvider url={ getSocketUrl(chain?.app_config) }>
      <TxsContent
        items={ query.data }
        isPlaceholderData={ query.isPlaceholderData }
        isError={ query.isError }
        pagination={ PAGINATION_PARAMS }
        sort="default"
        socketType="txs_home"
        stickyHeader={ false }
      />
      <Separator orientation="horizontal" hideFrom="lg"/>
      <Link
        href={ route({ pathname: '/txs', query: { chain_id: chain?.id, tab: 'txs_local' } }) }
        w="full"
        justifyContent="center"
        textStyle="sm"
        mt={ 3 }
      >
        View all transactions
      </Link>
    </SocketProvider>
  );
};

export default React.memo(LatestTxsLocal);
