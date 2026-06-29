// SPDX-License-Identifier: LicenseRef-Blockscout

import { INTERNAL_TX } from 'src/slices/internal-tx/stubs';

import type config from 'src/config';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import type { BlockQuery } from './useBlockQuery';

interface Params {
  heightOrHash: string;
  blockQuery: BlockQuery;
  tab: string;
  chainConfig: typeof config;
}

export default function useBlockInternalTxsQuery({ heightOrHash, blockQuery, tab, chainConfig }: Params) {
  const apiQuery = useQueryWithPages({
    resourceName: 'core:block_internal_txs',
    pathParams: { height_or_hash: heightOrHash },
    options: {
      enabled: Boolean(tab === 'internal_txs' && !blockQuery.isPlaceholderData && chainConfig.slices.internalTx.isEnabled),
      placeholderData: generateListStub<'core:block_internal_txs'>(INTERNAL_TX, 10, { next_page_params: null, meta: { message: null, status: 1 } }),
      refetchOnMount: false,
    },
  });

  return apiQuery;
}
