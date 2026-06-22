// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

interface Props {
  data: Array<schemas['Implementation']>;
  isLoading?: boolean;
  proxyType?: schemas['ProxyType'];
}

const AddressImplementations = ({ data, isLoading, proxyType }: Props) => {
  const hasManyItems = data.length > 1;
  const [ hasScroll, setHasScroll ] = React.useState(false);

  const text = proxyType === 'eip7702' ? 'Delegated to' : `Implementation${ hasManyItems ? 's' : '' }`;
  const hint = proxyType === 'eip7702' ?
    'Account\'s executable code address' :
    `Implementation${ hasManyItems ? 's' : '' } address${ hasManyItems ? 'es' : '' } of the proxy contract`;

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ hint }
        isLoading={ isLoading }
        hasScroll={ hasScroll }
      >
        { text }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValueWithScroll
        gradientHeight={ 48 }
        onScrollVisibilityChange={ setHasScroll }
        rowGap={ 2 }
        maxH="200px"
      >
        { data.map((item) => (
          <AddressEntity
            key={ item.address_hash }
            address={{
              hash: item.address_hash,
              filecoin: { robust: item.filecoin_robust_address ?? null, actor_type: null, id: null },
              name: item.name,
              is_contract: true,
            }}
            isLoading={ isLoading }
            noIcon
          />
        )) }
      </DetailedInfo.ItemValueWithScroll>
    </>
  );
};

export default React.memo(AddressImplementations);
