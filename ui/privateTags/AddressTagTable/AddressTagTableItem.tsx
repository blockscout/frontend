import React, { useCallback } from 'react';

import {
  Tag,
  Tr,
  Td,
  HStack,
} from '@chakra-ui/react'

import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';

import type { AddressTag } from 'types/api/account';
import EditButton from 'ui/shared/EditButton';
import DeleteButton from 'ui/shared/DeleteButton';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

interface Props {
  item: AddressTag;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
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
        <HStack spacing={ 4 }>
          <AddressIcon address={ item.address_hash }/>
          <AddressLinkWithTooltip address={ item.address_hash }/>
        </HStack>
      </Td>
      <Td>
        <TruncatedTextTooltip label={ item.name }>
          <Tag variant="gray" lineHeight="24px">
            { item.name }
          </Tag>
        </TruncatedTextTooltip>
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
