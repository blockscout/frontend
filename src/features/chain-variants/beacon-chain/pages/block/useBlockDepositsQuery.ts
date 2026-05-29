// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BlockQuery } from 'src/slices/block/hooks/useBlockQuery';

import config from 'src/config';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { DEPOSIT } from '../../stubs/deposits';

export type BlockDepositsQuery = QueryWithPagesResult<'core:block_deposits'> & {
  isDegradedData: boolean;
};

interface Params {
  heightOrHash: string;
  blockQuery: BlockQuery;
  tab: string;
}

const beaconChainFeature = config.features.beaconChain;

// No deposits data in RPC, so we use API only
export default function useBlockDepositsQuery({ heightOrHash, blockQuery, tab }: Params): BlockDepositsQuery {
  const apiQuery = useQueryWithPages({
    resourceName: 'core:block_deposits',
    pathParams: { height_or_hash: heightOrHash },
    options: {
      enabled:
        tab === 'deposits' &&
        beaconChainFeature.isEnabled && !beaconChainFeature.withdrawalsOnly &&
        !blockQuery.isPlaceholderData && !blockQuery.isDegradedData,
      placeholderData: generateListStub<'core:block_deposits'>(DEPOSIT, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
      refetchOnMount: false,
    },
  });

  return {
    ...apiQuery,
    isDegradedData: false,
  };
}
