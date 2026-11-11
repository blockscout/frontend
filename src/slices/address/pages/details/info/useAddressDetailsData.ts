// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

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

const isNotFoundError = (addressQuery: AddressQuery): boolean => {
  return addressQuery.isError && 'status' in addressQuery.error && addressQuery.error.status === 404;
};

export default function useAddressDetailsData({ addressQuery, addressHash }: Params): AddressDetailsData {
  const error404Data = React.useMemo<schemas['AddressResponse']>(() => ({
    hash: addressHash || '',
    is_contract: false,
    implementations: null,
    token: null,
    watchlist_address_id: null,
    watchlist_names: null,
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
  }), [ addressHash ]);

  if (addressQuery.isError) {
    if (!isCustomAppError(addressQuery.error)) {
      return { status: 'fetch_error' };
    }

    if (!isNotFoundError(addressQuery)) {
      throwOnResourceLoadError(addressQuery);
    }

    return { status: 'ready', data: error404Data };
  }

  if (!addressQuery.data) {
    return { status: 'empty' };
  }

  return { status: 'ready', data: addressQuery.data };
}
