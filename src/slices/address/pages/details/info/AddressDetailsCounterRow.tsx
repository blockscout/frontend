// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { AddressCountersQuery } from 'src/slices/address/hooks/useAddressCountersQuery';
import type { AddressQuery } from 'src/slices/address/hooks/useAddressQuery';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import AddressCounterItem from './AddressCounterItem';

interface Props {
  prop: keyof schemas['AddressCounters'];
  label: string;
  hint: string;
  addressQuery: AddressQuery;
  countersQuery: AddressCountersQuery;
  addressHash: string;
  isLoading: boolean | undefined;
  multiRow?: boolean;
}

const AddressDetailsCounterRow = ({ prop, label, hint, addressQuery, countersQuery, addressHash, isLoading, multiRow }: Props) => {
  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ hint }
        isLoading={ isLoading || countersQuery.isPlaceholderData }
      >
        { label }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow={ multiRow }>
        { addressQuery.data ? (
          <AddressCounterItem
            prop={ prop }
            query={ countersQuery }
            address={ addressHash }
            isAddressQueryLoading={ addressQuery.isPlaceholderData }
            isDegradedData={ addressQuery.isDegradedData }
          />
        ) :
          0 }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(AddressDetailsCounterRow);
