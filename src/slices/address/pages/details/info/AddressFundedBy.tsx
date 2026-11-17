// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useApiQuery from 'src/api/hooks/useApiQuery';
import type { ResourcePayload } from 'src/api/resources';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { findFundingTx } from 'src/slices/address/utils/find-funding-tx';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';
import { TX_ITEM } from 'src/slices/tx/stubs/tx';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  readonly addressHash: string;
  readonly isAddressLoading: boolean;
  readonly isEnabled: boolean;
}

const PLACEHOLDER_DATA: ResourcePayload<'core:address_txs'> = { items: [ TX_ITEM ], next_page_params: null };

const AddressFundedBy = ({ addressHash, isAddressLoading, isEnabled }: Props) => {
  const select = React.useCallback((response: ResourcePayload<'core:address_txs'>): schemas['Transaction'] | null => {
    return findFundingTx(response.items, addressHash) ?? null;
  }, [ addressHash ]);

  const query = useApiQuery('core:address_txs', {
    pathParams: { hash: addressHash },
    queryParams: { filter: 'to', sort: 'block_number', order: 'asc' },
    queryOptions: {
      enabled: isEnabled && Boolean(addressHash),
      placeholderData: PLACEHOLDER_DATA,
      refetchOnMount: false,
      select,
    },
  });

  const isLoading = isAddressLoading || (isEnabled && query.isPlaceholderData);
  const fundingTx = isLoading ? TX_ITEM : query.data;

  if (!fundingTx || (!isLoading && !isEnabled)) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Origin of the first transaction that funded this address"
        isLoading={ isLoading }
      >
        Funded by
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue gap={ 1 }>
        <AddressEntity
          address={ fundingTx.from }
          truncation="constant"
          noIcon
          isLoading={ isLoading }
        />
        <Skeleton loading={ isLoading }><span>at txn</span></Skeleton>
        <TxEntity hash={ fundingTx.hash } truncation="constant" noIcon isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(AddressFundedBy);
