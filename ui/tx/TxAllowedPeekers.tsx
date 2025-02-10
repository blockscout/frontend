import React from 'react';

import CutLinkList from 'toolkit/components/CutLink/CutLinkList';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  items: Array<string>;
}

const TxAllowedPeekers = ({ items }: Props) => {
  const renderItem = React.useCallback((item: string) => {
    return <AddressEntity key={ item } address={{ hash: item, is_contract: true }}/>;
  }, []);

  return (
    <>
      <DetailsInfoItem.Label
        hint="Smart contracts allowed to interact with confidential data"
      >
        Allowed peekers
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <CutLinkList
          items={ items }
          renderItem={ renderItem }
          cutLength={ 2 }
          rowGap={ 3 }
        />
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(TxAllowedPeekers);
