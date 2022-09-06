import {
  Tr,
  Td,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { CustomAbi } from 'types/api/account';

import AddressSnippet from 'ui/shared/AddressSnippet';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: CustomAbi;
  onEditClick: (item: CustomAbi) => void;
  onDeleteClick: (item: CustomAbi) => void;
}

const CustomAbiTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {

  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.id }>
      <Td>
        <AddressSnippet address={ item.contract_address_hash } subtitle={ item.name }/>
      </Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
      </Td>
    </Tr>
  );
};

export default React.memo(CustomAbiTableItem);
