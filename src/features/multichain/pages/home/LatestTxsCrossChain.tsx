// SPDX-License-Identifier: LicenseRef-Blockscout

import { Separator } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import TransactionsCrossChainContent from 'src/features/cross-chain-txs/components/txs/TransactionsCrossChainContent';
import { INTERCHAIN_MESSAGE } from 'src/features/cross-chain-txs/stubs/messages';

import { generateListStub } from 'src/shared/pagination/utils';

import { Link } from 'src/toolkit/chakra/link';

const TXS_NUM = 3;

const LatestTxsCrossChain = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('interchainIndexer:messages', {
    queryOptions: {
      placeholderData: generateListStub<'interchainIndexer:messages'>(INTERCHAIN_MESSAGE, TXS_NUM, { next_page_params: { page_token: 'token' } }),
    },
  });

  return (
    <>
      <TransactionsCrossChainContent
        items={ data?.items.slice(0, TXS_NUM) }
        isLoading={ isPlaceholderData }
        isError={ isError }
      />
      <Separator orientation="horizontal" hideFrom="lg"/>
      <Link
        href={ route({ pathname: '/txs', query: { tab: 'txs_cross_chain' } }) }
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
