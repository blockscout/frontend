import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import { route } from 'nextjs/routes';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import useApiQuery from 'lib/api/useApiQuery';
import { MultichainProvider } from 'lib/contexts/multichain';
import { SocketProvider } from 'lib/socket/context';
import { TX } from 'stubs/tx';
import { Link } from 'toolkit/chakra/link';
import TxsContent from 'ui/txs/TxsContent';

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

interface Props {
  chainSlug: string;
}

const LatestTxsLocal = ({ chainSlug }: Props) => {
  const query = useApiQuery('general:homepage_txs', {
    chainSlug,
    queryOptions: {
      placeholderData: Array(5).fill(TX),
      select: (data) => data.slice(0, 5),
    },
  });

  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainSlug);

  return (
    <MultichainProvider chainSlug={ chainSlug }>
      <SocketProvider url={ getSocketUrl(chainData?.config) }>
        <TxsContent
          items={ query.data || [] }
          isPlaceholderData={ query.isPlaceholderData }
          isError={ query.isError }
          pagination={ PAGINATION_PARAMS }
          sort="default"
          socketType="txs_home"
          stickyHeader={ false }
        />
        <Link
          href={ route({ pathname: '/txs', query: { 'chain-slug': chainSlug, tab: 'txs_local' } }) }
          w="full"
          justifyContent="center"
          textStyle="sm"
          mt={ 3 }
        >
          View all transactions
        </Link>
      </SocketProvider>
    </MultichainProvider>
  );
};

export default React.memo(LatestTxsLocal);
