// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';

import useApiQuery from 'src/api/hooks/useApiQuery';

import getQueryParamString from 'src/shared/router/get-query-param-string';

import { ARBITRUM_L2_TXN_BATCH } from '../../stubs';

export default function useBatchQuery() {
  const router = useRouter();
  const number = getQueryParamString(router.query.number);
  const height = getQueryParamString(router.query.height);
  const commitment = getQueryParamString(router.query.commitment);

  const batchByNumberQuery = useApiQuery('core:arbitrum_l2_txn_batch', {
    pathParams: { number },
    queryOptions: {
      enabled: Boolean(number),
      placeholderData: ARBITRUM_L2_TXN_BATCH,
    },
  });

  const batchByHeightQuery = useApiQuery('core:arbitrum_l2_txn_batch_celestia', {
    pathParams: { height, commitment },
    queryOptions: {
      enabled: Boolean(height && commitment),
      placeholderData: ARBITRUM_L2_TXN_BATCH,
    },
  });

  return number ? batchByNumberQuery : batchByHeightQuery;
}
