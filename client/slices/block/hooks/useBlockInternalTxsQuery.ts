// SPDX-License-Identifier: LicenseRef-Blockscout

import type config from 'client/config';

import { INTERNAL_TX } from 'client/slices/internal-tx/stubs';

import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';

import type { BlockQuery } from './useBlockQuery';

interface Params {
  heightOrHash: string;
  blockQuery: BlockQuery;
  tab: string;
  chainConfig: typeof config;
}

export default function useBlockInternalTxsQuery({ heightOrHash, blockQuery, tab, chainConfig }: Params) {
  const apiQuery = useQueryWithPages({
    resourceName: 'general:block_internal_txs',
    pathParams: { height_or_hash: heightOrHash },
    options: {
      enabled: Boolean(tab === 'internal_txs' && !blockQuery.isPlaceholderData && chainConfig.slices.internalTx.isEnabled),
      placeholderData: generateListStub<'general:block_internal_txs'>(INTERNAL_TX, 10, { next_page_params: null }),
      refetchOnMount: false,
    },
  });

  return apiQuery;
}
