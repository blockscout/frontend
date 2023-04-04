import { Tr, Td } from '@chakra-ui/react';
import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';

import { getStateElements } from './utils';

interface Props {
  data: TxStateChange;
}

const TxStateTableItem = ({ data }: Props) => {
  const { before, after, change, tag, tokenId } = getStateElements(data);

  return (
    <Tr>
      <Td lineHeight="30px">
        { tag }
      </Td>
      <Td>
        <Address height="30px">
          <AddressIcon address={ data.address }/>
          <AddressLink type="address" hash={ data.address.hash } alias={ data.address.name } fontWeight="500" truncation="constant" ml={ 2 }/>
        </Address>
      </Td>
      <Td isNumeric lineHeight="30px">{ before }</Td>
      <Td isNumeric lineHeight="30px">{ after }</Td>
      <Td isNumeric lineHeight="30px"> { change } </Td>
      <Td lineHeight="30px">{ tokenId }</Td>
    </Tr>
  );
};

export default React.memo(TxStateTableItem);
