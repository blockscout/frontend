import React, { useCallback } from 'react';

import {
  Tag,
  Tr,
  Td,
  HStack,
  Tooltip,
} from '@chakra-ui/react'

import EditButton from 'ui/shared/EditButton';
import DeleteButton from 'ui/shared/DeleteButton';

import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';

import type { TPrivateTagsTransactionItem } from 'data/privateTagsTransaction';

interface Props {
  item: TPrivateTagsTransactionItem;
  onEditClick: (data: TPrivateTagsTransactionItem) => void;
  onDeleteClick: (data: TPrivateTagsTransactionItem) => void;
}

const AddressTagTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <Tr alignItems="top" key={ item.transaction }>
      <Td>
        <AddressLinkWithTooltip address={ item.transaction }/>
      </Td>
      <Td>
        <Tooltip label={ item.tag }>
          <Tag variant="gray" lineHeight="24px">
            { item.tag }
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
  )
};

export default AddressTagTableItem;
