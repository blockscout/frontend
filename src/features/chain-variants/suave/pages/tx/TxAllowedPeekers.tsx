// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { CollapsibleList } from 'src/toolkit/chakra/collapsible';

interface Props {
  items: Array<string>;
}

const TxAllowedPeekers = ({ items }: Props) => {
  const renderItem = React.useCallback((item: string) => {
    return <AddressEntity key={ item } address={{ hash: item, is_contract: true }}/>;
  }, []);

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Smart contracts allowed to interact with confidential data"
      >
        Allowed peekers
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <CollapsibleList
          items={ items }
          renderItem={ renderItem }
          cutLength={ 2 }
          rowGap={ 3 }
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxAllowedPeekers);
