// SPDX-License-Identifier: LicenseRef-Blockscout

import { INTERCHAIN_TRANSFER } from 'src/features/cross-chain-txs/stubs/messages';

import config from 'src/config';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';

interface Props {
  hash: string;
  enabled?: boolean;
}

export default function useTxCrossChainTransfersQuery({ hash, enabled = true }: Props) {
  return useApiPaginatedQuery({
    resourceName: 'interchainIndexer:tx_transfers',
    pathParams: { hash },
    options: {
      placeholderData: generateListStub<'interchainIndexer:tx_transfers'>(INTERCHAIN_TRANSFER, 5, { next_page_params: undefined }),
      enabled: enabled && config.features.crossChainTxs.isEnabled,
      staleTime: Infinity,
    },
  });
}
