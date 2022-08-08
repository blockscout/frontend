import {
  Tag,
  Tr,
  Td,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { TransactionTag } from 'types/api/account';

import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
import DeleteButton from 'ui/shared/DeleteButton';
import EditButton from 'ui/shared/EditButton';

interface Props {
  item: TransactionTag;
  onEditClick: (data: TransactionTag) => void;
  onDeleteClick: (data: TransactionTag) => void;
}

const AddressTagTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.id }>
      <Td>
        <AddressLinkWithTooltip address={ item.transaction_hash }/>
      </Td>
      <Td>
        <Tooltip label={ item.name }>
          <Tag variant="gray" lineHeight="24px">
            { item.name }
          </Tag>
        </Tooltip>
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

export default AddressTagTableItem;
