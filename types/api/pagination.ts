import type {
  AddressTxsFilters,
  AddressTokenTransferFilters,
} from 'types/api/address';
import type { BlockFilters } from 'types/api/block';
import type { TokenTransferFilters } from 'types/api/tokenTransfer';
import type { TTxsFilters } from 'types/api/txsFilters';

import type { ResourcePayload } from 'lib/api/useApiQuery';

export type PaginatedResources = 'blocks' | 'block_txs' |
'txs_validated' | 'txs_pending' |
'tx_internal_txs' | 'tx_logs' | 'tx_token_transfers' |
'address_txs' | 'address_internal_txs' | 'address_token_transfers' | 'address_blocks_validated' | 'address_coin_balance';

export type PaginatedResponseX<Q extends PaginatedResources> = ResourcePayload<Q>;

export type PaginationFiltersX<Q extends PaginatedResources> =
  Q extends 'blocks' ? BlockFilters :
    Q extends 'txs_validated' | 'txs_pending' ? TTxsFilters :
      Q extends 'tx_token_transfers' ? TokenTransferFilters :
        Q extends 'address_txs' | 'address_internal_txs' ? AddressTxsFilters :
          Q extends 'address_token_transfers' ? AddressTokenTransferFilters :
            never;
