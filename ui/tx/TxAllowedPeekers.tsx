import React from 'react';

import CutLinkList from 'toolkit/components/CutLink/CutLinkList';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
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
      <DetailedInfo.ItemLabel
        hint="Smart contracts allowed to interact with confidential data"
      >
        Allowed peekers
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <CutLinkList
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
