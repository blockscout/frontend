import React from 'react';

import type { AddressImplementation } from 'types/api/addressParams';

import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  data: Array<AddressImplementation>;
  isLoading?: boolean;
}

const AddressImplementations = ({ data, isLoading }: Props) => {
  const hasManyItems = data.length > 1;
  const [ hasScroll, setHasScroll ] = React.useState(false);

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `Implementation${ hasManyItems ? 's' : '' } address${ hasManyItems ? 'es' : '' } of the proxy contract` }
        isLoading={ isLoading }
        hasScroll={ hasScroll }
      >
        { `Implementation${ hasManyItems ? 's' : '' }` }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValueWithScroll
        gradientHeight={ 48 }
        onScrollVisibilityChange={ setHasScroll }
        rowGap={ 2 }
        maxH="200px"
      >
        { data.map((item) => (
          <AddressEntity
            key={ item.address }
            address={{
              hash: item.address,
              filecoin: { robust: item.filecoin_robust_address },
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
