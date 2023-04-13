import { Td, Tr, Link } from '@chakra-ui/react';
import React from 'react';

import type { VerifiedAddress } from 'types/api/account';

import AddressSnippet from 'ui/shared/AddressSnippet';

interface Props {
  item: VerifiedAddress;
  onAdd: (address: string) => void;
  onEdit: (item: VerifiedAddress) => void;
}

const VerifiedAddressesTableItem = ({ item, onAdd }: Props) => {

  const handleAddClick = React.useCallback(() => {
    onAdd(item.contractAddress);
  }, [ item, onAdd ]);

  return (
    <Tr>
      <Td>
        <AddressSnippet address={{ hash: item.contractAddress, is_contract: true, implementation_name: null }}/>
      </Td>
      <Td>
        <Link onClick={ handleAddClick }>Add details</Link>
      </Td>
      <Td></Td>
      <Td></Td>
    </Tr>
  );
};

export default React.memo(VerifiedAddressesTableItem);
