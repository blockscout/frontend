import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

import type { VerifiedAddress } from 'types/api/account';

import AddressSnippet from 'ui/shared/AddressSnippet';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: VerifiedAddress;
  onEdit: (item: VerifiedAddress) => void;
  onDelete: (item: VerifiedAddress) => void;
}

const VerifiedAddressesTableItem = ({ item, onEdit, onDelete }: Props) => {

  const handleEditClick = React.useCallback(() => {
    onEdit(item);
  }, [ item, onEdit ]);

  const handleDeleteClick = React.useCallback(() => {
    onDelete(item);
  }, [ item, onDelete ]);

  return (
    <Tr>
      <Td>
        <AddressSnippet address={{ hash: item.contractAddress, is_contract: true, implementation_name: null }}/>
      </Td>
      <Td>Add details</Td>
      <Td></Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ handleDeleteClick } onEditClick={ handleEditClick }/>
      </Td>
    </Tr>
  );
};

export default React.memo(VerifiedAddressesTableItem);
