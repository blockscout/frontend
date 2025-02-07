import { useRouter } from 'next/router';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ARBITRUM_L2_TXN_BATCH } from 'stubs/arbitrumL2';

export default function useBatchQuery() {
  const router = useRouter();
  const number = getQueryParamString(router.query.number);
  const height = getQueryParamString(router.query.height);
  const commitment = getQueryParamString(router.query.commitment);

  const batchByNumberQuery = useApiQuery('arbitrum_l2_txn_batch', {
    pathParams: { number },
    queryOptions: {
      enabled: Boolean(number),
      placeholderData: ARBITRUM_L2_TXN_BATCH,
    },
  });

  const batchByHeightQuery = useApiQuery('arbitrum_l2_txn_batch_celestia', {
    pathParams: { height, commitment },
    queryOptions: {
      enabled: Boolean(height && commitment),
      placeholderData: ARBITRUM_L2_TXN_BATCH,
    },
  });

  return number ? batchByNumberQuery : batchByHeightQuery;
}
