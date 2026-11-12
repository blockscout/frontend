// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { ResourceError } from 'src/api/resources';

import type { AddressQuery } from 'src/slices/address/hooks/useAddressQuery';

import isCustomAppError from 'src/shared/errors/is-custom-app-error';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';

export type AddressDetailsData =
  | { status: 'fetch_error' } |
  { status: 'empty' } |
  { status: 'ready'; data: schemas['AddressResponse'] };

interface Params {
  addressQuery: AddressQuery;
  addressHash: string;
}

const isNotFoundError = (error: ResourceError<{ status: number }>): boolean => error.status === 404;

export default function useAddressDetailsData({ addressQuery, addressHash }: Params): AddressDetailsData {
  const error404Data = React.useMemo<schemas['AddressResponse']>(() => ({
    hash: addressHash || '',
    is_contract: false,
    implementations: [],
    token: null,
    watchlist_address_id: null,
    watchlist_names: [],
    creation_transaction_hash: null,
    block_number_balance_updated_at: null,
    name: null,
    exchange_rate: null,
    coin_balance: null,
    has_tokens: true,
    has_token_transfers: true,
    has_validated_blocks: false,
    filecoin: undefined,
    celo: undefined,
    creator_filecoin_robust_address: null,
    creator_address_hash: null,
    creation_status: null,
    ens_domain_name: null,
    has_beacon_chain_withdrawals: false,
    has_logs: false,
    is_scam: false,
    is_verified: false,
    metadata: null,
    proxy_type: null,
    reputation: 'ok',
    private_tags: [],
    public_tags: [],
  }), [ addressHash ]);

  if (addressQuery.isError) {
    if (!isCustomAppError(addressQuery.error)) {
      return { status: 'fetch_error' };
    }

    if (!isNotFoundError(addressQuery.error)) {
      throwOnResourceLoadError(addressQuery);
    }

    return { status: 'ready', data: error404Data };
  }

  if (!addressQuery.data) {
    return { status: 'empty' };
  }

  return { status: 'ready', data: addressQuery.data };
}
