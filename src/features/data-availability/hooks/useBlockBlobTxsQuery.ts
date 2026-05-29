// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BlockQuery } from 'src/slices/block/hooks/useBlockQuery';
import { TX } from 'src/slices/tx/stubs/tx';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

interface Params {
  heightOrHash: string;
  blockQuery: BlockQuery;
  tab: string;
}

export default function useBlockBlobTxsQuery({ heightOrHash, blockQuery, tab }: Params) {
  const apiQuery = useQueryWithPages({
    resourceName: 'core:block_txs',
    pathParams: { height_or_hash: heightOrHash },
    filters: { type: 'blob_transaction' },
    options: {
      enabled: Boolean(tab === 'blob_txs' && !blockQuery.isPlaceholderData && blockQuery.data?.blob_transactions_count),
      placeholderData: generateListStub<'core:block_txs'>(TX, 3, { next_page_params: null }),
      refetchOnMount: false,
    },
  });

  return apiQuery;
}
