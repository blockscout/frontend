// SPDX-License-Identifier: LicenseRef-Blockscout

import { INTERNAL_TX } from 'client/slices/internal-tx/stubs';

import type config from 'configs/app';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

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
      enabled: Boolean(tab === 'internal_txs' && !blockQuery.isPlaceholderData && chainConfig.UI.views.internalTx.isEnabled),
      placeholderData: generateListStub<'general:block_internal_txs'>(INTERNAL_TX, 10, { next_page_params: null }),
      refetchOnMount: false,
    },
  });

  return apiQuery;
}
