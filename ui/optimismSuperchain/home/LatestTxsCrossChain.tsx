import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { INTEROP_MESSAGE } from 'stubs/optimismSuperchain';
import { generateListStub } from 'stubs/utils';
import { Link } from 'toolkit/chakra/link';

import CrossChainTxs from '../crossChainTxs/CrossChainTxs';

const LatestTxsCrossChain = () => {

  const { data, isError, isPlaceholderData } = useApiQuery('multichain:interop_messages', {
    queryOptions: {
      placeholderData: generateListStub<'multichain:interop_messages'>(INTEROP_MESSAGE, 5, { next_page_params: undefined }),
      select: (data) => ({ ...data, items: data.items.slice(0, 5) }),
    },
  });

  return (
    <>
      <CrossChainTxs
        items={ data?.items }
        isLoading={ isPlaceholderData }
        isError={ isError }
        socketType="txs_home_cross_chain"
      />
      <Link
        href={ route({ pathname: '/txs' }) }
        w="full"
        justifyContent="center"
        textStyle="sm"
        mt={ 3 }
      >
        View all transactions
      </Link>
    </>
  );
};

export default React.memo(LatestTxsCrossChain);
