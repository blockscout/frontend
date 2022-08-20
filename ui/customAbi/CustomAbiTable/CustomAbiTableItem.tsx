import {
  Tr,
  Td,
  HStack,
  Text,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { CustomAbi } from 'types/api/account';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DeleteButton from 'ui/shared/DeleteButton';
import EditButton from 'ui/shared/EditButton';

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
        <HStack>
          <Text fontSize="md" fontWeight={ 600 }>{ item.contract_address_hash }</Text>
          <CopyToClipboard text={ item.contract_address_hash }/>
        </HStack>
        <Text fontSize="sm" marginTop={ 0.5 } variant="secondary">{ item.name }</Text>
      </Td>
      <Td>
        <HStack spacing={ 6 }>
          <EditButton onClick={ onItemEditClick }/>
          <DeleteButton onClick={ onItemDeleteClick }/>
        </HStack>
      </Td>
    </Tr>
  );
};

export default React.memo(CustomAbiTableItem);
